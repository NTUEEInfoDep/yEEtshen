import { debounce } from 'throttle-debounce';
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

app.renderer.backgroundColor = 0xffff00;
const canvas = app.view;
document.body.appendChild(canvas);

window.addEventListener(
  'resize',
  debounce(40, () => {
    app.view.width = scaleRatio * window.innerWidth;
    app.view.height = scaleRatio * window.innerHeight;
    updateBackgroundGraphics();
  })
);

let textures = {
  bullet: PIXI.Texture.from('assets/bullet.svg'),
  ship: PIXI.Texture.from('assets/ship.svg')
};

let shipSprites = {};
let bulletSprites = {};
let shipUpdateFlag = true;
let bulletUpdateFlag = true;
let background = new PIXI.Graphics();
let boundaries = new PIXI.Graphics();
updateBoundariesGraphics();
updateBackgroundGraphics();
app.stage.addChild(background);
app.stage.addChild(boundaries);

function render() {
  const { me, others, bullets } = getCurrentState();
  if (!me) {
    return;
  }
  prepareSprite(shipSprites, [me], textures.ship, shipUpdateFlag);
  prepareSprite(shipSprites, others, textures.ship, shipUpdateFlag);
  recycleSprite(shipSprites, shipUpdateFlag);
  shipUpdateFlag = !shipUpdateFlag;

  prepareSprite(bulletSprites, bullets, textures.bullet, bulletUpdateFlag);
  recycleSprite(bulletSprites, bulletUpdateFlag);
  bulletUpdateFlag = !bulletUpdateFlag;

  // Draw boundaries
  boundaries.x = canvas.width / 2 - me.x;
  boundaries.y = canvas.height / 2 - me.y;

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function prepareSprite(spriteHash, objectArray, texture, latestUpdateFlag) {
  const len = objectArray.length;
  if (!objectArray || !len) return;
  for (let i = 0; i < len; ++i) {
    if (!spriteHash[objectArray[i].id]) {
      spriteHash[objectArray[i].id] = new PIXI.Sprite(texture);
      app.stage.addChild(spriteHash[objectArray[i].id]);
    }
    spriteHash[objectArray[i].id].updateFlag = latestUpdateFlag;
  }
}

function recycleSprite(spriteHash, latestUpdateFlag) {
  Object.keys(spriteHash).forEach(playerID => {
    if (spriteHash[playerID].updateFlag !== latestUpdateFlag) {
      app.stage.removeChild(spriteHash[playerID]);
      delete spriteHash[playerID];
    }
  });
}

function updateBackgroundGraphics() {
  background.beginFill(0x000000);
  background.drawRect(0, 0, canvas.width, canvas.height);
  background.endFill();
}

function updateBoundariesGraphics() {
  boundaries.beginTextureFill(createRadialGradientTexture());
  boundaries.lineStyle(1, 0xffffff);
  boundaries.drawRect(0, 0, MAP_SIZE, MAP_SIZE);
  boundaries.endFill();
}

function createRadialGradientTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = MAP_SIZE;
  canvas.height = MAP_SIZE;
  const context = canvas.getContext('2d');
  const HALF_MAP_SIZE = MAP_SIZE / 2;
  const gradient = context.createRadialGradient(
    HALF_MAP_SIZE,
    HALF_MAP_SIZE,
    MAP_SIZE / 10,
    HALF_MAP_SIZE,
    HALF_MAP_SIZE,
    MAP_SIZE / 2
  );
  gradient.addColorStop(0, 'black');
  gradient.addColorStop(1, 'gray');
  context.fillStyle = gradient;
  context.fillRect(0, 0, MAP_SIZE, MAP_SIZE);
  return new PIXI.Texture.from(canvas);
}

function renderPlayerOnMonitor(x, y) {
  const mapToMonitorScale = MONITOR_SIZE / MAP_SIZE;
  const [monitorX, monitorY] = [mapToMonitorScale * x, mapToMonitorScale * y];
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
}

function renderMainMenu() {
  boundaries.x = -(MAP_SIZE - canvas.width) / 2;
  boundaries.y = -(MAP_SIZE - canvas.height) / 2;
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
