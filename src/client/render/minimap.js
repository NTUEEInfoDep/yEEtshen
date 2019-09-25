import * as PIXI from 'pixi.js';
import SpritePool from './spritepool';

const { MAP_SIZE } = require('../../shared/constants');

// ===========================================

// The size of the minimap
const size = 175;

// The position of the minimap in the canvas
const canvasX = 10;
const canvasY = 10;

// The ratio of minimap size with respect to the map size
const minimapToMapRatio = size / MAP_SIZE;

// The radius of the points(me and others) on the minimap
const pointRadius = 2;

// The color of the points
const meColor = 0xffff00;
const othersColor = 0x0000ff;

// ===========================================

// Translate a player information into a point on the minimap.
function translatePlayerToPoint(player) {
  const { x, y } = player;
  const point = {
    x: (x * size / MAP_SIZE),
    y: (y * size / MAP_SIZE)
  }
  return point;
}

// The points on the minimap
class PointPool {
  // minimap: PIXI.Container instance
  constructor(minimap) {
    this.minimap = minimap;

    this.lastShowNum = 0;

    // Add a point into the pool(me)
    const me = {x: 0, y: 0};
    this.addSingle(me, meColor);
    // minimap.children[0].visible = false;
  }

  // Hide first `count` points
  hideMany(count) {
    const points = this.minimap.children;
    const len = points.length;
    for (let i = 0; i < len; ++i) {
      points[i].visible = false;
    }
  }

  addSingle(point, color) {
    const { x, y } = point;

    const pointGraphic = new PIXI.Graphics();
    pointGraphic.beginFill(color);
    pointGraphic.drawCircle(x, y, pointRadius);
    pointGraphic.endFill();

    this.minimap.addChild(pointGraphic);
  }

  setSingle(point, index) {
    const { x, y } = point;
    const pointGraphic = this.minimap.children[index];

    // set position
    pointGraphic.x = x;
    pointGraphic.y = y;

    // make it visible
    pointGraphic.visible = true;
  }

  render(me, others) {
    // translate all players into points
    const points = [];
    points[0] = translatePlayerToPoint(me);
    for (let other of others) {
      points.push(translatePlayerToPoint(other));
    }

    const pointCount = points.length;
    const poolLength = this.minimap.children.length;

    // hide original points
    this.hideMany(this.lastShowNum);

    // set or add points and show them
    for (let i = 0; i < pointCount; i++) {
      if (i < poolLength) {
        this.setSingle(points[i], i);
      } else {
        this.addSingle(points[i], othersColor);
      }
    }

    // update lastShowNum
    this.lastShowNum = pointCount;
  }

}

// ===========================================

export default class Minimap {
  constructor(app) {
    // Create the minimap
    const minimap = new PIXI.Graphics();
    this.minimap = minimap;
    app.stage.addChild(minimap);

    // Make the minimap invisible
    minimap.visible = false;

    // Draw the minimap
    minimap.beginFill(0xffffff, 0.5);
    minimap.drawRect(0, 0, size, size);
    minimap.endFill();
    minimap.x = canvasX;
    minimap.y = canvasY;

    // create a point pool
    this.pointPool = new PointPool(minimap);
  }

  // When not playing.
  renderWhenNotPlaying() {
    this.minimap.visible = false;
  }

  // When playing.
  render(me, others) {
    // make the minimap visible
    this.minimap.visible = true;

    // let the pointPool render the points
    this.pointPool.render(me, others);
  }
}
