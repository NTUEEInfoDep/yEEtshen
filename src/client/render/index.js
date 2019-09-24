import { debounce } from 'throttle-debounce';
import { getCurrentState } from '../state';
import * as PIXI from 'pixi.js';
import * as Background from './background';
import  BulletPool  from './bulletpool';
import PlayerPool from './playerpool';
import ItemPool from './itempool';

const Constants = require('../../shared/constants');

// ==============================================

const app = new PIXI.Application({
  backgroundColor: 0xff0000,
  forceCanvas: true,
});

const canvas = app.view;
document.body.appendChild(canvas);
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can
  // still see at least 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

// ===============================================

Background.initialize(app);

// create SpritePool
const playerPool = new PlayerPool(app);
const bulletPool = new BulletPool(app);
const itemPool = new ItemPool(app);

function render() {
  const { me, others, bullets, items } = getCurrentState();
  if (!me) { return; }

  // render background
  Background.renderWhenPlay(me);

  // render all players
  playerPool.render(me, others);

  // render bullets
  bulletPool.render(me, bullets);

  // render items
  itemPool.render(me, items);

  console.log(itemPool.sprites.length);
}

// ==============================================

let renderInterval = setInterval(Background.renderWhenMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(Background.renderWhenMainMenu, 1000 / 60);
}
