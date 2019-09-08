const leaderboard = document.getElementById('leaderboard');
const rows = document.querySelectorAll('#leaderboard table tr');

export function updateLeaderboard(data) {
  // This is a bit of a hacky way to do this and can get dangerous if you don't escape usernames
  // properly. You would probably use something like React instead if this were a bigger project.
  for (let i = 0; i < data.length; i++) {
    rows[i + 1].children[0].textContent =
      data[i].username.slice(0, 15) || 'Anonymous';
    rows[i + 1].children[1].textContent = data[i].score.toString();
  }
  for (let i = data.length; i < 5; i++) {
    rows[i + 1].children[0].textContent = '-';
    rows[i + 1].children[1].textContent = '-';
  }
}

export function setLeaderboardHidden(hidden) {
  if (hidden) {
    leaderboard.classList.add('hidden');
  } else {
    leaderboard.classList.remove('hidden');
  }
}
