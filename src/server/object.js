class Obj {
  constructor(id, x, y, dir, speed, rotateSpeed = 0) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.rotateSpeed = rotateSpeed;
    this.speed = speed;
  }

  update(dt) {
    // Todo: Add rotateSpeed to direction
    this.direction += this.rotateSpeed;
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir) {
    this.direction = dir;
  }

  setRotateSpeed(rotateSpeed) {
    this.rotateSpeed = rotateSpeed;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Obj;
