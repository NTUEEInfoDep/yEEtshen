import device from 'current-device';
import { updateRotateSpeed, playerFire } from './networking';
import { PLAYER_ROTATION_SPEED } from '../shared/constants';
import Keyboard from './keyboard';
import { leftBtn, rightBtn, fireBtn } from './button';

// check if mobile
const isBtn = device.mobile() || device.tablet();
const left = isBtn ? leftBtn : new Keyboard('ArrowLeft');
const right = isBtn ? rightBtn : new Keyboard('ArrowRight');
const space = isBtn ? fireBtn : new Keyboard(' ');

// Add Keyboard Press Function
left.press = () => { updateRotateSpeed(-PLAYER_ROTATION_SPEED); };
right.press = () => { updateRotateSpeed(PLAYER_ROTATION_SPEED); };
// fire a bullet or item
space.press = () => { playerFire(); };

// Keyboard Release Function
left.release = () => { updateRotateSpeed(0); };
right.release = () => { updateRotateSpeed(0); };
space.release = () => { console.log('Space key is Released'); };

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
