module.exports = Object.freeze({
  PLAYER_RADIUS: 25,
  PLAYER_MAX_HP: 10,
  PLAYER_SPEED: 250,
  PLAYER_FIRE_COOLDOWN: 0.25,
  PLAYER_ROTATION_SPEED: 5 * Math.PI / 180,

  PLAYER_STATE_PARAMETERS: {
    FREEZE_DURATION: 3000,
    SHIELD_DURATION: 10000,
    LIGHTSWORD_DURATION: 10000,
    LIGHTSWORD_RADIUS: 50,
    LIGHTSWORD_SPEED: 350,
    LIGHTSWORD_DAMAGE: 4,
    WEED_DURATION: 8000,
  },

  BULLET_RADIUS: 3,
  BULLET_WIDTH: 2,
  BULLET_HEIHGT: 8,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 1,

  ITEM_RADIUS: 20,

  ITEMS_PARAMETERS: {
    HEALBAG_HEAL_HP: 2,
    SHIELD_LAST_TIME: 5, // seconds
    SHOTGUN_BULLET_NUMBER: 30
  },

  ITEM_EVENTS_PARAMETERS: {
    FREEZING_AREA_RADIUS: 100,
    FREEZING_AREA_DURATION: 3000,
    BOMB_EXPLOSIONS_NUMBER: 6,
    BOMB_EXPLOSIONS_RADIUS: 150,
    BOMB_EXPLOSION_DAMAGE: 4,
    BOMB_EXPLOSION_RADIUS: 200,
    //BOMB_EXPLOSION_DELAY: 500,
    BOMB_EXPLOSION_HIT: 666,
    BOMB_EXPLOSION_END: 1583,
    CANNON_EXPLOSION_DAMAGE: 3,
    CANNON_EXPLOSION_RADIUS: 100,
    //CANNON_EXPLOSION_DELAY: 500,
    CANNON_EXPLOSION_HIT: 666,
    CANNON_EXPLOSION_END: 1583,
    CANNON_EXPLOSION_GENERATE_INTERVAL: 100,
  },

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_SIZE: 2000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    PLAYER_FIRE: 'fire',
    GAME_OVER: 'dead',
  },

  ANIMATION_SPEED: 0.2,
});    