import * as PIXI from 'pixi.js';

import device from 'current-device';
import { debounce } from 'throttle-debounce';
import { getCurrentState } from '../state';

import Background from './background';
import BulletArray from './bulletArray';
import PlayerArray from './playerArray';
import ItemArray from './itemArray';
import ItemEventArray from './itemEventArray';
import WeedArray from './weedArray';
import BorderArray from './borderArray';
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
  const scaleRatio = Math.max(1, 600 / Math.min(window.innerWidth, window.innerHeight));
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

// ===============================================

// background
const background = new Background(app);

// sprite pools
const borderArray = new BorderArray(app);
const itemEventArray = new ItemEventArray(app);
const itemArray = new ItemArray(app);
const playerArray = new PlayerArray(app);
const bulletArray = new BulletArray(app);
const weedArray = new WeedArray(app);

let lastUpdateTime = Date.now();


// render button if mobile
const isBtn = device.mobile() || device.tablet();
if (isBtn) {
  app.stage.addChild(rightBtn.btnSprite);
  app.stage.addChild(leftBtn.btnSprite);
  app.stage.addChild(fireBtn.btnSprite);
}

function renderButton() {
  rightBtn.setpos(canvas.width - 80, canvas.height - 70);
  leftBtn.setpos(canvas.width - 150, canvas.height - 70);
  fireBtn.setpos(100, canvas.height - 70);
}

// When playing.
function render() {
  const { me, others, bullets, items, itemEvents } = getCurrentState();
  if (!me) { return; }

  // render button
  if (isBtn) { renderButton(); }
  // render background
  background.render(me);

  borderArray.render(me);

  // render events
  itemEventArray.render(me, itemEvents);

  // render items
  itemArray.render(me, items);

  // render all players
  playerArray.render(me, [me, ...others]);

  // render bullets
  bulletArray.render(me, bullets);

  //render weeds
  weedArray.render( me, ( Date.now() - lastUpdateTime )/1000 );
  lastUpdateTime = Date.now();
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
