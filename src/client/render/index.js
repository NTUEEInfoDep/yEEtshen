import * as PIXI from 'pixi.js';

import device from 'current-device';
import { debounce } from 'throttle-debounce';
import { getCurrentState } from '../state';

import Background from './background';
import BulletPool from './bulletpool';
import PlayerPool from './playerpool';
import ItemPool from './itempool';
import { rightBtn, leftBtn, fireBtn } from '../button';

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

// render button if mobile: todo: check mobile
function renderButton() {
  if (device.mobile() || device.tablet()) {
    rightBtn.setpos(canvas.width - 80, canvas.height - 70);
    leftBtn.setpos(canvas.width - 150, canvas.height - 70);
    fireBtn.setpos(100, canvas.height - 200);
    app.stage.addChild(rightBtn.btnSprite);
    app.stage.addChild(leftBtn.btnSprite);
    app.stage.addChild(fireBtn.btnSprite);
  }
}

// When playing.
function render() {
  const { me, others, bullets, items } = getCurrentState();
  if (!me) { return; }

  //render button
  renderButton();
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
