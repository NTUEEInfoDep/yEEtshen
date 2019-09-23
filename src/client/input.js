import { updateRotateSpeed, playerFire } from './networking';
import { PLAYER_ROTATION_SPEED } from '../shared/constants';
import Keyboard from './keyboard';

const left = new Keyboard('ArrowLeft');
const right = new Keyboard('ArrowRight');
const space = new Keyboard(' ');

// Add Keyboard Press Function
left.press = () => {
  updateRotateSpeed(-PLAYER_ROTATION_SPEED);
  console.log('Left Key is Pressed');
};

right.press = () => {
  updateRotateSpeed(PLAYER_ROTATION_SPEED);
  console.log('Right Key is Pressed');
};

// fire a bullet or item
space.press = () => {
  playerFire();
  console.log('Space key is pressed');
};

// Keyboard Release Function
left.release = () => {
  updateRotateSpeed(0);
  console.log('Left Key is Released');
};

right.release = () => {
  updateRotateSpeed(0);
  console.log('Right Key is Released');
};

space.release = () => {
  console.log('Space key is Released');
};

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
