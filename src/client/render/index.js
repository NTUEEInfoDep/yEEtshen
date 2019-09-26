import { debounce } from 'throttle-debounce';
import { getCurrentState } from '../state';
import * as PIXI from 'pixi.js';
import Background from './background';
import  BulletPool  from './bulletpool';
import PlayerPool from './playerpool';
import ItemPool from './itempool';

const Constants = require('../../shared/constants');

// ==============================================

const app = new PIXI.Application({
  backgroundColor: 0x666666,
  forceCanvas: true,
  antialias: true,
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

// background
const background = new Background(app);

// sprite pools
const playerPool = new PlayerPool(app);
const bulletPool = new BulletPool(app);
const itemPool = new ItemPool(app);

// When playing.
function render() {
  const { me, others, bullets, items } = getCurrentState();
  if (!me) { return; }

  // render background
  background.render(me);

  // render all players
  playerPool.render(me, others);

  // render bullets
  bulletPool.render(me, bullets);

  // render items
  itemPool.render(me, items);
}

// When not playing.
function renderWhenNotPlaying() {
  background.renderWhenNotPlaying();
}

// ===============================================

let renderInterval = setInterval(renderWhenNotPlaying, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderWhenNotPlaying, 1000 / 60);
}
