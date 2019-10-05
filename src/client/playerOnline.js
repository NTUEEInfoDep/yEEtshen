const playerOnlineNum = document.getElementById('playerOnlineNum');

export function updatePlayerOnline(num) {
    playerOnlineNum.textContent = num;
}

export function setPlayerOnlineHidden(hidden) {
  if (hidden) {
    playerOnline.classList.add('hidden');
  } else {
    playerOnline.classList.remove('hidden');
  }
}
