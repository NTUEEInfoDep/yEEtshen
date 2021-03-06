import device from 'current-device';
import { throttle } from 'throttle-debounce';
import { updateRotateSpeed, playerFire } from './networking';
import { PLAYER_ROTATION_SPEED } from '../shared/constants';
import Keyboard from './keyboard';
import { leftBtn, rightBtn, fireBtn } from './button';

const Constants = require('../shared/constants');

// check if mobile
const isBtn = device.mobile() || device.tablet() || window.screen.widtn <= 768;
const left = isBtn ? leftBtn : new Keyboard('ArrowLeft');
const right = isBtn ? rightBtn : new Keyboard('ArrowRight');
const space = isBtn ? fireBtn : new Keyboard(' ');
let activeRotationKey = null;

// Add Keyboard Press Function
left.press = () => {
  updateRotateSpeed(-PLAYER_ROTATION_SPEED);
  activeRotationKey = left;
};
right.press = () => {
  updateRotateSpeed(PLAYER_ROTATION_SPEED);
  activeRotationKey = right;
};
// fire a bullet or item
// space.press = throttle(() => { playerFire(); };
space.press = throttle(Constants.BULLET_SHOOT_SPEET, () => { playerFire(); });

// Keyboard Release Function
left.release = () => {
  if(activeRotationKey === left) {
    updateRotateSpeed(0);
    activeRotationKey = null;
  }
};
right.release = () => { 
  if(activeRotationKey === right) {
    updateRotateSpeed(0);
    activeRotationKey = null;
  }
};
space.release = () => {  };

export function startCapturingInput() {
  left.subscribe();
  right.subscribe();
  space.subscribe();
}

export function stopCapturingInput() {
  left.unsubscribe();
  right.unsubscribe();
  space.unsubscribe();
}
