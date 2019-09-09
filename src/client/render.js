// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';
import * as PIXI from 'pixi.js';

const Constants = require('../shared/constants');

const {
  PLAYER_RADIUS,
  PLAYER_MAX_HP,
  BULLET_RADIUS,
  MAP_SIZE,
  MONITOR_PIXEL_OFFSET,
  MONITOR_SIZE,
  MONITOR_MARGIN
} = Constants;

const scaleRatio = Math.max(1, 800 / window.innerWidth);
// Get the canvas graphics context
let app = new PIXI.Application({
  width: scaleRatio * window.innerWidth,
  height: scaleRatio * window.innerHeight
});
// app.renderer.backgroundColor = 0xffffff;
const canvas = app.view;
document.body.appendChild(canvas);
app.renderer.clearBeforeRender = true;

window.addEventListener(
  'resize',
  debounce(40, () => {
    app.view.width = scaleRatio * window.innerWidth;
    app.view.height = scaleRatio * window.innerHeight;
  })
);

let textures = {
  bullet: PIXI.Texture.from('assets/bullet.svg'),
  ship: PIXI.Texture.from('assets/ship.svg')
};

let shipSprites = {};
let bulletSprites = {};

function render() {
  const { me, others, bullets, ...rest } = getCurrentState();
  if (!me) {
    return;
  }
  prepareSprite(shipSprites, [me], textures.ship);
  prepareSprite(shipSprites, others, textures.ship);
  prepareSprite(bulletSprites, bullets, textures.bullet);
  console.log(Object.keys(bulletSprites).length);

  // // Draw background
  // renderBackground(me.x, me.y);

  // // Draw boundaries
  // app.renderer.context.strokeStyle = 'black';
  // app.renderer.context.lineWidth = 1;
  // app.renderer.context.strokeRect(
  //   canvas.width / 2 - me.x,
  //   canvas.height / 2 - me.y,
  //   MAP_SIZE,
  //   MAP_SIZE
  // );

  // // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

let latestUpdateFlag = true;
function prepareSprite(spriteHash, objectArray, texture) {
  const len = objectArray.length;
  if (!objectArray || !len) return;
  for (let i = 0; i < len; ++i) {
    if (!spriteHash[objectArray[i].id]) {
      spriteHash[objectArray[i].id] = new PIXI.Sprite(texture);
      app.stage.addChild(spriteHash[objectArray[i].id]);
    }
    spriteHash[objectArray[i].id].inUse = latestUpdateFlag;
  }

  Object.keys(spriteHash).forEach(playerID => {
    if (spriteHash[playerID].inUse !== latestUpdateFlag) {
      app.stage.removeChild(spriteHash[playerID]);
      delete spriteHash[playerID];
    }
  });

  latestUpdateFlag = !latestUpdateFlag;
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderPlayerOnMonitor(x, y) {
  const mapToMonitorScale = MONITOR_SIZE / MAP_SIZE;
  const [monitorX, monitorY] = Object.freeze([
    mapToMonitorScale * x,
    mapToMonitorScale * y
  ]);
  const canvasX = MONITOR_MARGIN + monitorX;
  const canvasY = canvas.height - MONITOR_SIZE - MONITOR_MARGIN + monitorY;
  context.fillStyle = 'yellow';
  context.fillRect(
    canvasX,
    canvasY,
    MONITOR_PIXEL_OFFSET,
    MONITOR_PIXEL_OFFSET
  );
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction, id } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  const ship = shipSprites[id];

  ship.x = canvasX;
  ship.y = canvasY;
  ship.anchor.x = 0.5;
  ship.anchor.y = 0.5;
  ship.rotation = direction;

  // Draw ship
  // context.save();
  // context.translate(canvasX, canvasY);
  // context.rotate(direction);
  // context.drawImage(
  //   getAsset('ship.svg'),
  //   -PLAYER_RADIUS,
  //   -PLAYER_RADIUS,
  //   PLAYER_RADIUS * 2,
  //   PLAYER_RADIUS * 2
  // );
  // context.restore();

  // Draw health bar
  // context.fillStyle = 'white';
  // context.fillRect(
  //   canvasX - PLAYER_RADIUS,
  //   canvasY + PLAYER_RADIUS + 8,
  //   PLAYER_RADIUS * 2,
  //   2
  // );
  // context.fillStyle = 'red';
  // context.fillRect(
  //   canvasX - PLAYER_RADIUS + (PLAYER_RADIUS * 2 * player.hp) / PLAYER_MAX_HP,
  //   canvasY + PLAYER_RADIUS + 8,
  //   PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
  //   2
  // );

  // renderPlayerOnMonitor(x, y);
}

function renderBullet(me, bullet) {
  const { x, y, id } = bullet;
  bulletSprites[id].x = canvas.width / 2 + x - me.x - BULLET_RADIUS;
  bulletSprites[id].y = canvas.height / 2 + y - me.y - BULLET_RADIUS;
  // context.drawImage(
  //   getAsset('bullet.svg'),
  //   canvas.width / 2 + x - me.x - BULLET_RADIUS,
  //   canvas.height / 2 + y - me.y - BULLET_RADIUS,
  //   BULLET_RADIUS * 2,
  //   BULLET_RADIUS * 2
  // );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  // renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
