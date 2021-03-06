const ObjectClass = require('../object');
const Constants = require('../../shared/constants');
const Item = require('../Items/');
const ItemEvent = require('../ItemEvents/');

// ============================================

class ComputerPlayer extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.COMPUTER_PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.COMPUTER_PLAYER_MAX_HP;
    this.fireCooldown = 0.35; // seconds
    this.dt = 0;
    this.item = null; // the item that the player owns
    this.state = {}; // freeze, shield, lightSword, weed, damaged

    // The bullets that the player owns
    this.bulletNum = Infinity;

    // Store the return value of setInterval for the bullets.
    this.fireInterval = null;

    // The player ID and name of the other player who kill this player.
    this.beKilledByID = null;
    this.beKilledByName = null;

    this.isCollided = false;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    
    this.move();

    if( !this.state.freeze ) {
      super.update(dt);
    }

    // store dt
    this.dt = dt;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // update state
    this.updateState();

  }

  // should modify the rotationSpeed or direction
  move() {
    console.error("The move() method for each computerplayer must be implemented!");
  }

  updateState() {
    this.isCollided = false;
    if ( this.state.freeze ) {
      if ( Date.now() - this.state.freeze > Constants.PLAYER_STATE_PARAMETERS.FREEZE_DURATION ) {
        delete this.state.freeze;
      }
    }
    if ( this.state.weed ) {
      if ( Date.now() - this.state.weed > Constants.PLAYER_STATE_PARAMETERS.WEED_DURATION ) {
        delete this.state.weed;
      }
    }
    if ( this.state.damaged ) {
      if ( Date.now() - this.state.damaged > Constants.PLAYER_STATE_PARAMETERS.DAMAGED_DURATION ) {
        delete this.state.damaged;
      }
    }
  }

  //take damage and give score
  takeDamage( damage, parentID, parentName ) {
    if (this.state.shield) {
      delete this.state.shield;
      return false;
    }
    if (this.hp > 0) {
      this.hp -= damage;
      this.state.damaged = Date.now();
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
      else if (this.bulletNum > 0) {
        const bulletArray = this.shot();
        return { bullets: bulletArray }
      }
    }
    return {};
  }

  // should return array of bullets
  shot() {
    console.error("The shot() method for each computerplayer must be implemented!");
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
      this.radius = Constants.COMPUTER_PLAYER_RADIUS;
      this.speed = Constants.COMPUTER_PLAYER_SPEED;
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
    };
  }
}

module.exports = ComputerPlayer;
