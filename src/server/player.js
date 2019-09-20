const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.item = null; // the item that the player owns
    this.dt = 0;
    // Special states affected by items
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // store dt
    this.dt = dt;

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // If the player has item, make the item synce.
    if (this.item) {
      this.item.synceWith(this);
    }

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

  takeBulletDamage() {
    // If the player has shield and has use it, take zero damage
    if ((!this.item) || (this.item.name !== 'SHIELD') || (!this.item.used)) {
      this.hp -= Constants.BULLET_DAMAGE;
    }
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  // Fire Bullet or Item(Todo)
  handleFire() {
    return new Bullet(this.id, this.x, this.y, this.direction);
  }

  useItem() {
    return this.item.use();
  }

  // called when collide with another player
  collideWith(other) {
    this.x -= this.dt * this.speed * Math.sin(this.direction);
    this.y += this.dt * this.speed * Math.cos(this.direction);
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Player;
