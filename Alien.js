function Alien(descr) {

  this.setup(descr);

  this.type = descr.type;
  this.sprite = this.sprite || g_sprites.aliens[this.type];

  this.width = this.sprite.width;
  this.height = this.sprite.height;

  let gapLeftWall = this.width * 2;
  let gapTopWall = this.height * 1.5;
  let gapBetween = this.width / 10;

  //this.cx = gapLeftWall + descr.x * (gapBetween + this.width); // This is now moved to update function of entityManager
  this.x = descr.x; // its index in the _aliens_x_position grid in entityManager
  this.cy = gapTopWall + descr.y * (gapBetween + this.height);
  this.velX = 0.5;

  this.animationInterval = 0.25 * SECS_TO_NOMINALS;
  this.animationTimer = 0;
  this.isExploding = false;
  this.isAttacking = true;

};

Alien.prototype = new Entity();

Alien.prototype.update = function (du) {
  spatialManager.unregister(this);

  if (this._isDeadNow) return entityManager.KILL_ME_NOW;

  this.animationTimer += du;

  if (this.isExploding) {
    if (this.sprite.frame === this.sprite.numFrames-1) {
      return entityManager.KILL_ME_NOW;
    }
    return;
  }

  /* Old code for updating alien position, this is now moved to entityManager.
  let direction = entityManager.getAliensDirection();
  let nextX = this.cx + (this.velX * direction * du);
  let nextX = entityManager.getAlienPosition(this.x);
  let halfWidth = this.sprite.width / 2;
  if (nextX < halfWidth || nextX > g_canvas.width - halfWidth) {
    entityManager.changeAliensDirection();
  }
  this.cx = nextX;
  */  
  this.cx = entityManager.getAlienPosition(this.x);

  if (this.isAttacking) {
    this.maybeFireBullet();
  }

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

Alien.prototype.takeBulletHit = function (bullet) {
  // Aliens can't kill aliens
  if (bullet.type === "enemyBullet") {
    return;
  }

  this.sprite.setAnimation("explosion");
  this.isExploding = true;
  this.animationInterval = 0.10 * SECS_TO_NOMINALS
};


Alien.prototype.maybeFireBullet = function () {
  let probability = util.randRange(0, 5000);
  if (probability < 2) {
    entityManager.fireEnemyBullet(this.cx, this.cy + this.sprite.height / 2, 2)
  }
};