import { updateRotateSpeed, playerFire } from './networking';
import { PLAYER_ROTATION_SPEED } from '../shared/constants';

function keyboard(val) {
  const key = {};
  key.val = val;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = e => {
    if (e.key === key.val) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      e.preventDefault();
    }
  };

  key.upHandler = e => {
    if (e.key === key.val) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      e.preventDefault();
    }
  };

  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  key.subscribe = () => {
    window.addEventListener('keydown', downListener, false);
    window.addEventListener('keyup', upListener, false);
  };

  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
}

const left = keyboard('ArrowLeft');
const right = keyboard('ArrowRight');
const space = keyboard(' ');

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
