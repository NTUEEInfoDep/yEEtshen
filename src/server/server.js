const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.VIRTUAL, virtual) // listen a signal form virtual()
  socket.on(Constants.MSG_TYPES.DESTROY_VIRTUAL, destroyVirtual)
  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on(Constants.MSG_TYPES.PLAYER_FIRE, handleFire);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();

function virtual() {
  console.log('create virtual user');
  game.addVirtualPlayer(this);
}

function destroyVirtual() {
  console.log('destroy virtual user');
  game.removeVirtualPlayer(this);
}

function joinGame(username) {
  let spriteIdx = Math.floor(8 * Math.random());
  console.log('add a new player');
  game.addPlayer(this, username, spriteIdx);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function handleFire() {
  game.handleFire(this);
}

function onDisconnect() {
  game.removePlayer(this);
}
