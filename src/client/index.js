import { connect, play, virtual, destroyVirtual } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import { setBroadcastBoardHidden } from './broadcast';

import * as PIXI from 'pixi.js';
import './css/main.css';
const Constants = require('../shared/constants');

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

const gameoverBoard = document.getElementById('gameover-board');
const replayButton = document.getElementById('replay-button');

const nameMessage = document.getElementById("name-message");
const killedMessage = document.getElementById('killed-message');
const scoreMessage = document.getElementById('score-message');

let username = "";

connect(onGameOver)
.then(() => {
  playMenu.classList.remove('hidden');
  // create virtual player
  createVirtualPlayer();
  // =================================
  usernameInput.focus();
  // click the playButton or press Enter to start playing
  playButton.onclick = playSetup;
  replayButton.onclick = replaySetup;
  usernameInput.onkeypress = (e) => {
    // Enter key event code == 13
    if (e.which == 13) { playSetup(); }
  };
  
}).catch(console.error);

function onGameOver(message) {
  stopCapturingInput();
  stopRendering();

  nameMessage.textContent = message.name;
  killedMessage.textContent = message.killedBy;
  killedMessage.style.color = message.color;
  scoreMessage.textContent = message.score.toString();
  gameoverBoard.classList.remove('hidden');

  setLeaderboardHidden(true);
  setBroadcastBoardHidden(true);
}

// set up for playing
function playSetup() {
  if (!usernameInput.value) {
    alert('Please enter your name!');
    return;
  }
  username = usernameInput.value;
  // remove virtual player
  removeVirtualPlayer();
  // add a player
  initState();
  play(usernameInput.value);
  playMenu.classList.add('hidden');
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
  setBroadcastBoardHidden(false);
}

// set up for replaying
function replaySetup() {
  play(username);
  gameoverBoard.classList.add('hidden');
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
  setBroadcastBoardHidden(false);
}

// create a virtual player for menu background
const createVirtualPlayer = () => {
  virtual();
  initState();
  startRendering();
}

// remove virtual player when entering the game
const removeVirtualPlayer = () => {
  destroyVirtual();
  stopCapturingInput();
  stopRendering();
}