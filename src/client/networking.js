import io from 'socket.io-client';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socket = io(`ws://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.VIRTUAL_GAME_UPDATE, processGameUpdate, true)
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
  })
);

export const play = (username) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateRotateSpeed = rotateSpeed => {
  socket.emit(Constants.MSG_TYPES.INPUT, rotateSpeed);
};

export const playerFire = () => {
  socket.emit(Constants.MSG_TYPES.PLAYER_FIRE);
};

export const virtual = () => {
  socket.emit(Constants.MSG_TYPES.VIRTUAL);
}

export const destroyVirtual = () => {
  socket.emit(Constants.MSG_TYPES.DESTROY_VIRTUAL)
}
