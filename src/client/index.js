import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import { setBroadcastBoardHidden } from './broadcast';

import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

const gameoverBoard = document.getElementById('gameover-board');
const replayButton = document.getElementById('replay-button');
const replayUsernameInput = document.getElementById('replay-username-input');

const killedMessage = document.getElementById('killed-message');
const scoreMessage = document.getElementById('score-message');

connect(onGameOver)
.then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  replayUsernameInput.focus();
  // click the playButton or press Enter to start playing
  playButton.onclick = playSetup;
  replayButton.onclick = replaySetup;
  usernameInput.onkeypress = (e) => {
    // Enter key event code == 13
    if (e.which == 13) { playSetup(); }
  };
  replayUsernameInput.onkeypress = (e) => {
    // Enter key event code == 13
    if (e.which == 13) { replaySetup(); }
  };
}).catch(console.error);

function onGameOver(message) {
  stopCapturingInput();
  stopRendering();

  killedMessage.innerHTML =
    "You've been killed by <b>" + message.killedBy + "</b>.";
  scoreMessage.innerHTML =
    "Your score is <b>" + message.score.toString() + "</b>.";
  gameoverBoard.classList.remove('hidden');

  setLeaderboardHidden(true);
  setBroadcastBoardHidden(true);
}

// set up for playing
function playSetup() {
  play(usernameInput.value);
  playMenu.classList.add('hidden');
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
  setBroadcastBoardHidden(false);
}

// set up for replaying
function replaySetup() {
  play(replayUsernameInput.value);
  gameoverBoard.classList.add('hidden');
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
  setBroadcastBoardHidden(false);
}
