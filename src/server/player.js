const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const Item = require('./Items/');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.dt = 0;
    this.item = null; // the item that the player owns
    this.state = {}; // freeze, shield, lightSword, weed
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
  takeDamage( damage ) {
    if ( this.state.shield ) {
      this.hp -= damage;
      return true;
    }
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  // Fire Bullet or Item
  handleFire() {
    if( !this.state.freeze ) {
      if( this.item ) {
        return this.item.use( this );
      }
      else {
        const newBullet = new Bullet(this.id, this.x, this.y, this.direction);
        return { bullets: [newBullet] }
      }
    }
  }

  // called when collide with another player
  collideWith(other) {
    this.x -= this.dt * this.speed * Math.sin(this.direction);
    this.y += this.dt * this.speed * Math.cos(this.direction);
    if ( this.state.lightSword ) {
      if ( other.takeDamage( Constants.PLAYER_STATE_PARAMETERS.LIGHTSWORD_DAMAGE ) ) {
        this.onDealtDamage()
      }
      delete this.state.lightSword;
      this.radius = Constants.PLAYER_RADIUS;
      this.speed = Constants.PLAYER_SPEED;
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
      item: this.getItemName(),
      state: Object.keys( this.state )
    };
  }
}

module.exports = Player;
