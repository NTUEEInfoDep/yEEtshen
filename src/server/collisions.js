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
        player.takeDamage( Constants.BULLET_DAMAGE, bullet.parentID, bullet.parentName);
        break;
      }
    }
  }
  return destroyedBullets;
}

function itemCollisions(players, items) {
  const destroyedItems = [];
  for ( let item of items ) {
    for ( let player of Object.values(players) ) {
      if ( player.distanceTo( item ) <= Constants.PLAYER_RADIUS + Constants.ITEM_RADIUS ) {
        console.log( `item ${item.constructor.name} collected!` );
        item.beCollected( player );
        destroyedItems.push( item );
        break;
      }
    }
  }
  return destroyedItems;
}

// check if a player collide with other player
// if collide:  speed decline
function playerCollisions(player, others) {
  others.forEach(other => {
    if (player.id !== other.id && player.distanceTo(other) <= Constants.PLAYER_RADIUS * 1.5) {
      player.collideWith(other);
    }
  });
}


module.exports = {
  applyCollisions,
  itemCollisions,
  playerCollisions,
};
