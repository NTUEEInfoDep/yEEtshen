const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  const destroyedBullets = [];
  // Cache length of array
  const playerCount = players.length,
    bulletCount = bullets.length;
  for (let i = 0; i < bulletCount; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < playerCount; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <=
          Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}

module.exports = applyCollisions;
