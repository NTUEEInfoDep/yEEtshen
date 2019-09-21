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
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // store dt
    this.dt = dt;

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    // this.fireCooldown -= dt;
    // if (this.fireCooldown <= 0) {
    //   this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
    //   return new Bullet(this.id, this.x, this.y, this.direction);
    // }

    // return null;
  }

  // TODO: use takeDamage instead
  takeBulletDamage() {
    // If the player has shield and has use it, take zero damage
    if ((!this.item) || (this.item.name !== 'SHIELD') || (!this.item.used)) {
      this.hp -= Constants.BULLET_DAMAGE;
    }
  }
  
  //take damage and return true if success
  takeDamage( damage ) {
    //TODO: if hp > 0 and no shield
    this.hp -= damage;
    return true;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  // Fire Bullet or Item
  handleFire() {
    if( this.item ) {
      return this.item.use( this );
    }
    else {
      const newBullet = new Bullet(this.id, this.x, this.y, this.direction);
      return { bullets: [newBullet] }
    }
  }

  // called when collide with another player
  collideWith(other) {
    this.x -= this.dt * this.speed * Math.sin(this.direction);
    this.y += this.dt * this.speed * Math.cos(this.direction);
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
      item: this.getItemName()
    };
  }
}

module.exports = Player;
