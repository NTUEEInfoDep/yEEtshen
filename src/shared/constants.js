module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,
  PLAYER_ROTATION_SPEED: 5 * Math.PI / 180,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 10,

  ITEM_RADIUS: 20,
  ITEM_IMAGES: {
    ITEM: 'happy.svg',
    HEALBAG: 'heart.svg',
    SHIELD: 'shield.svg',
    BOMB: 'malware.svg',

    // When shield used and taking effect, render this image
    SHIELD_USED: 'shield_used.svg',
    // when bomb used, render this image
    BOMB_USED: 'flammable.svg',
  },
  ITEMS_PARAMETERS: {
    HEALBAG_HEAL_HP: 20,
    SHIELD_LAST_TIME: 5, // seconds
    BOMB_DAMAGE: 30,
    BOMB_EXPLODE_RADIUS: 150,
    BOMB_EXPLODE_LAST_TIME: 0.1, // seconds
  },

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_SIZE: 1000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    PLAYER_FIRE: 'fire',
    GAME_OVER: 'dead',
  },
  MONITOR_PIXEL_OFFSET: 2,
  MONITOR_SIZE: 100,
  MONITOR_MARGIN: 10,
});
