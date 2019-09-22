import { debounce } from 'throttle-debounce';
import { getCurrentState } from '../state';
import * as PIXI from 'pixi.js';
import  BulletPool  from './bulletpool';
import PlayerPool from './playerpool';

const Constants = require('../../shared/constants');

const {
  MAP_SIZE,
} = Constants;


// Get the canvas graphics context
const app = new PIXI.Application({
  backgroundColor: 0xff0000,
  forceCanvas: true,
});

const canvas = app.view;
setCanvasDimensions();
document.body.appendChild(canvas);

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));


// window.addEventListener(
//   'resize',
//   debounce(40, () => {
//     const scaleRatio = Math.max(1, 800 / window.innerWidth);
//     canvas.width = scaleRatio * window.innerWidth;
//     canvas.height = scaleRatio * window.innerHeight;
//     // updateBackgroundGraphics();
//   }),
// );

// const background = new PIXI.Graphics();
const boundaries = new PIXI.Graphics();
updateBoundariesGraphics();
// updateBackgroundGraphics();
// app.stage.addChild(background);
app.stage.addChild(boundaries);

const textures = {
  bullet: PIXI.Texture.from('assets/bullet.svg'),
  ship: PIXI.Texture.from('assets/ship.svg')
};

// create SpritePool
const bulletPool = new BulletPool(app, textures.bullet);
const playerPool = new PlayerPool(app, textures.ship);

function render() {
  const { me, others, bullets } = getCurrentState();
  if (!me) { return; }

  // Draw boundaries
  boundaries.x = canvas.width / 2 - me.x;
  boundaries.y = canvas.height / 2 - me.y;

  // render bullet
  bulletPool.render(me, bullets, canvas);
  // add me to others
  others.unshift(me);
  // render all players
  playerPool.render(me, others, canvas);
}

// function updateBackgroundGraphics() {
//   background.beginFill(0xff0000);
//   background.drawRect(0, 0, canvas.width, canvas.height);
//   background.endFill();
// }

function updateBoundariesGraphics() {
  boundaries.beginFill(0x00ff00);
  // boundaries.beginTextureFill(createRadialGradientTexture());
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
