import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');


connect(onGameOver)
.then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  // click the playButton or press Enter to start playing
  playButton.onclick = playSetup;
  usernameInput.onkeypress = (e) => {
    // Enter key event code == 13
    if (e.which == 13) { playSetup(); }
  };
}).catch(console.error);

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
}

// set up for playing
function playSetup() {
  play(usernameInput.value);
  playMenu.classList.add('hidden');
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
}
