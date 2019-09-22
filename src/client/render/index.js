import { debounce } from 'throttle-debounce';
import { getCurrentState } from '../state';
import * as PIXI from 'pixi.js';
import * as Background from './background';
import  BulletPool  from './bulletpool';
import PlayerPool from './playerpool';

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

const textures = {
  bullet: PIXI.Texture.from('assets/bullet.svg'),
  ship: PIXI.Texture.from('assets/ship.svg')
};

Background.initialize(app);

// create SpritePool
const bulletPool = new BulletPool(app, textures.bullet);
const playerPool = new PlayerPool(app, textures.ship);

function render() {
  const { me, others, bullets } = getCurrentState();
  if (!me) { return; }

  // Draw background
  Background.renderWhenPlay(me);

  // render bullet
  bulletPool.render(me, bullets, canvas);
  // add me to others
  others.unshift(me);
  // render all players
  playerPool.render(me, others, canvas);
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
