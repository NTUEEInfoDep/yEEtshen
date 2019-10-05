const Utils = require('../shared/utils');
const { LEADERBOARD_SIZE } = require('../shared/constants');
const leaderboard = document.getElementById('leaderboard');
const rows = document.querySelectorAll('#leaderboard table tr');

export function updateLeaderboard(data, player) {
  // This is a bit of a hacky way to do this and can get dangerous if you don't escape usernames
  // properly. You would probably use something like React instead if this were a bigger project.
  for (let i = 0; i < LEADERBOARD_SIZE; i++) {
    rows[i + 1].children[0].textContent =
      Utils.truncateName(data[i].username, 14);
    rows[i + 1].children[1].textContent = data[i].score.toString();
  }
  for (let i = data.length; i < LEADERBOARD_SIZE; i++) {
    if(data[i].username === 'virtualplayer') {
      rows[i + 1].children[0].textContent = '-';
      rows[i + 1].children[1].textContent = '-';
    }
  }

  rows[LEADERBOARD_SIZE + 2].children[0].textContent = Utils.truncateName(player.username, 14);
  rows[LEADERBOARD_SIZE + 2].children[1].textContent = player.score.toString();

}

export function setLeaderboardHidden(hidden) {
  if (hidden) {
    leaderboard.classList.add('hidden');
  } else {
    leaderboard.classList.remove('hidden');
  }
}
