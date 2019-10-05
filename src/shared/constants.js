module.exports = Object.freeze({
  PLAYER_RADIUS: 40,
  PLAYER_MAX_HP: 10,
  PLAYER_SPEED: 350,
  PLAYER_FIRE_COOLDOWN: 0.25,
  PLAYER_ROTATION_SPEED: 5 * Math.PI / 180,

  PLAYER_STATE_PARAMETERS: {
    FREEZE_DURATION: 3000,
    SHIELD_DURATION: 10000,
    LIGHTSWORD_DURATION: 10000,
    LIGHTSWORD_RADIUS: 68,
    LIGHTSWORD_SPEED: 450,
    LIGHTSWORD_DAMAGE: 4,
    WEED_DURATION: 8000,
  },

  BULLET_RADIUS: 12,
  BULLET_WIDTH: 2,
  BULLET_HEIHGT: 8,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 1,
  BULLET_LENGTH: 800,
  BULLET_SHOOT_SPEET: 200,

  ITEM_RADIUS: 26,

  ITEMS_PARAMETERS: {
    HEALBAG_HEAL_HP: 2,
    SHIELD_LAST_TIME: 3, // seconds
    SHOTGUN_BULLET_NUMBER: 20
  },

  ITEM_EVENTS_PARAMETERS: {
    FREEZING_AREA_RADIUS: 100,
    FREEZING_AREA_DURATION: 3000,
    BOMB_EXPLOSIONS_NUMBER: 6,
    BOMB_EXPLOSIONS_RADIUS: 200,
    BOMB_EXPLOSION_DAMAGE: 4,
    BOMB_EXPLOSION_RADIUS: 200,
    //BOMB_EXPLOSION_DELAY: 500,
    BOMB_EXPLOSION_HIT: 366,
    BOMB_EXPLOSION_END: 1583,
    CANNON_EXPLOSION_DAMAGE: 3,
    CANNON_EXPLOSION_RADIUS: 200,
    //CANNON_EXPLOSION_DELAY: 500,
    CANNON_EXPLOSION_HIT: 366,
    CANNON_EXPLOSION_END: 1583,
    CANNON_EXPLOSION_GENERATE_INTERVAL: 100,
  },

  ITEM_MAX_NUM: {
    HEALBAG: 15,
    SHIELD: 15,
    LIGHTSWORD: 10,
    BOMB: 5,
    FREEZEBOMB: 10,
    WEED: 15,
    SHOTGUN: 5,
    CANNON: 5,
  },

  KILLED_SCORE: {
    BASE_SCORE: 1000,
    RATIO: 0.5,
    UPPERBOUND: 5000,
  },
  SCORE_PER_SECOND: Math.PI,

  BORDER_LENGTH: 354,
  MAP_SIZE: 5310,
  MSG_TYPES: {
    VIRTUAL: 'virtual',
    DESTROY_VIRTUAL: 'destory_virtual',
    VIRTUAL_GAME_UPDATE: 'virtual_update',
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    PLAYER_FIRE: 'fire',
    GAME_OVER: 'dead',
  },

  ANIMATION_SPEED: 0.2,
  ANIMATION_SCALE: 2,
});    