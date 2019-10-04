const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const Item = require('./Items/');

class Player extends ObjectClass {
  constructor(id, username, x, y, spriteIdx) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.dt = 0;
    this.item = null; // the item that the player owns
    this.state = {}; // freeze, shield, lightSword, weed
    this.spriteIdx = spriteIdx;

    // The player ID and name of the other player who kill this player.
    this.beKilledByID = null;
    this.beKilledByName = null;

    // The new broadcasts related to that player.
    this.broadcasts = [];

    this.isCollided = false;
  }

  // Returns a newly created bullet, or null.
  update(dt) {

    if( !this.state.freeze ) {
      super.update(dt);
    }

    // store dt
    this.dt = dt;

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // update state
    this.updateState();

    // Fire a bullet, if needed
    // this.fireCooldown -= dt;
    // if (this.fireCooldown <= 0) {
    //   this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
    //   return new Bullet(this.id, this.x, this.y, this.direction);
    // }

    // return null;
  }

  updateState() {
    this.isCollided = false;
    if ( this.state.freeze ) {
      if ( Date.now() - this.state.freeze > Constants.PLAYER_STATE_PARAMETERS.FREEZE_DURATION ) {
        delete this.state.freeze;
      }
    }
    if ( this.state.shield ) {
      if ( Date.now() - this.state.shield > Constants.PLAYER_STATE_PARAMETERS.SHIELD_DURATION ) {
        delete this.state.shield;
      }
    }
    if ( this.state.weed ) {
      if ( Date.now() - this.state.weed > Constants.PLAYER_STATE_PARAMETERS.WEED_DURATION ) {
        delete this.state.weed;
      }
    }
  }

  // TODO: use takeDamage instead
  takeBulletDamage() {
    // If the player has shield and has use it, take zero damage
    if ((!this.item) || (this.item.name !== 'SHIELD') || (!this.item.used)) {
      this.hp -= Constants.BULLET_DAMAGE;
    }
  }

  //take damage and give score
  takeDamage( damage, parentID, parentName ) {
    if ( !this.state.shield && this.hp > 0 ) {
      this.hp -= damage;
      if ( this.hp <= 0) {
        this.beKilledByID = parentID;
        this.beKilledByName = parentName;
      }
      return true;
    }
    return false;
  }

  onDealtDamage() {
    // this.score += Constants.SCORE_BULLET_HIT;
  }

  // Fire Bullet or Item
  handleFire() {
    if( !this.state.freeze ) {
      if( this.item ) {
        return this.item.use( this );
      }
      else {
        const newBullet = new Bullet(this.id, this.x, this.y, this.direction, this.username);
        return { bullets: [newBullet] }
      }
    }
    return {};
  }

  // called when collide with another player
  collideWith(other) {
    if (!this.isCollided && !this.state.freeze) {
      this.x -= this.dt * this.speed * Math.sin(this.direction);
      this.y += this.dt * this.speed * Math.cos(this.direction);
      this.isCollided = true;
    }
    if ( this.state.lightSword ) {
      other.takeDamage( Constants.PLAYER_STATE_PARAMETERS.LIGHTSWORD_DAMAGE, this.id, this.username);
      delete this.state.lightSword;
      this.radius = Constants.PLAYER_RADIUS;
      this.speed = Constants.PLAYER_SPEED;
    }
    if ( other.state.lightSword ) {
      this.takeDamage( Constants.PLAYER_STATE_PARAMETERS.LIGHTSWORD_DAMAGE, other.id, other.username);
      delete other.state.lightSword;
      other.radius = Constants.PLAYER_RADIUS;
      other.speed = Constants.PLAYER_SPEED;
    }
  }

  getItemName() {
    if( this.item ) return this.item.name;
    else return null;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      username: this.username,
      item: this.getItemName(),
      state: Object.keys( this.state ),
      spriteIdx: this.spriteIdx
    };
  }
}

module.exports = Player;
