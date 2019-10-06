const playerOnlineNum = document.getElementById('playerOnlineNum');
const computerOnlineNum = document.getElementById('computerOnlineNum');

export function updatePlayerOnline(playerNum, computerNum) {
    playerOnlineNum.textContent = playerNum;
    computerOnlineNum.textContent = computerNum;
}

export function setPlayerOnlineHidden(hidden) {
  if (hidden) {
    playerOnline.classList.add('hidden');
  } else {
    playerOnline.classList.remove('hidden');
  }
}
