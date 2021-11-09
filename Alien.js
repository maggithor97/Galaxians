function Alien(descr) {

  this.setup(descr);

  this.type = descr.type;
  this.sprite = this.sprite || g_sprites.aliens[this.type];

  this.width = this.sprite.width;
  this.height = this.sprite.height;

  let gapLeftWall = this.width * 2;
  let gapTopWall = this.height * 1.5;
  let gapBetween = this.width / 10;

  this.cx = gapLeftWall + descr.x * (gapBetween + this.width),
  this.cy = gapTopWall + descr.y * (gapBetween + this.height),

  this.velX = 5;

  this.animationInterval = 0.25 * SECS_TO_NOMINALS;
  this.animationTimer = 0;
};

Alien.prototype = new Entity();

Alien.prototype.update = function (du) {
  spatialManager.unregister(this);
  
  if (this._isDeadNow) return entityManager.KILL_ME_NOW;
  
  this.animationTimer += du;
  //if (this.cy < 0 || this.cy > g_canvas.height) return entityManager.KILL_ME_NOW;

  /*
  let nextX = this.velX * du;
  if (nextX < 0 || nextX > g_canvas.width) this.velX *= -1;
  this.cx += nextX;
  */
 
  spatialManager.register(this);
};

Alien.prototype.render = function (ctx) {

  this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy);

  if (this.animationTimer > this.animationInterval) {
      this.sprite.nextFrame();
      this.animationTimer = 0;
  }

};

Alien.prototype.getRadius = function () {
  return (this.sprite.width / 2) * 0.65;
};

Alien.prototype.takeBulletHit = function () {
  this.kill();
};