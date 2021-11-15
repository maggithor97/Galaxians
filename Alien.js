function Alien(descr) {

  this.setup(descr);

  this.type = descr.type;
  this.sprite = this.sprite || g_sprites.aliens[this.type];

  this.width = this.sprite.width;
  this.height = this.sprite.height;

  let gapLeftWall = this.width * 2;
  let gapTopWall = this.height * 1.5;
  let gapBetween = this.width / 10;

  this.cx = gapLeftWall + descr.x * (gapBetween + this.width);
  this.cy = gapTopWall + descr.y * (gapBetween + this.height);
  this.velX = 0.5;

  this.animationInterval = 0.25 * SECS_TO_NOMINALS;
  this.animationTimer = 0;
  this.isExploding = false;
  this.isAttacking = false;

};

Alien.prototype = new Entity();

Alien.prototype.update = function (du) {
  spatialManager.unregister(this);

  if (this._isDeadNow) return entityManager.KILL_ME_NOW;

  this.animationTimer += du;

  if (this.isExploding) {
    if (this.sprite.frame === this.sprite.numFrames - 1) {
      return entityManager.KILL_ME_NOW;
    }
    return;
  }

  if (this.isAttacking) {
    this.updateAttackingAlien(du);
    spatialManager.register(this);
    return;
  }

  let direction = entityManager.getAliensDirection();
  let nextX = this.cx + (this.velX * direction * du);
  let halfWidth = this.sprite.width / 2;

  if (nextX < halfWidth || nextX > g_canvas.width - halfWidth) {
    entityManager.changeAliensDirection();
  }

  this.cx = nextX;

  if (Math.random() * 15000 < 2) {
    this.makeAlienAttack()
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


Alien.prototype.updateAttackingAlien = function (du) {
  var wavespeed = 0.01;
  this.t = (this.t + wavespeed) % (Math.PI * 2);
  var a = Math.sin(this.t) * 1;
  //this.cx = this.attackStartX + Math.sin(this.angleRadians) * a;
  //this.cy += 0.7;
  var c = (Math.cos(this.angleRadians));
  var s = (Math.sin(this.angleRadians));

  var wobble = a * Math.cos(1.5 * this.t) * 1;
  var velX = c * 1.5 - s * wobble;
  var velY = s * 1.5 + c * wobble;
  this.cx += velX
  this.cy += velY

  if(this.cy < 300 && this.cy > 295) {
    entityManager.fireEnemyBullet(this.cx, this.cy + this.sprite.height / 2, 2)
  }
  if(this.cy > g_canvas.height) {
    this.isAttacking=false
  }
};

Alien.prototype.makeAlienAttack = function () {
  this.isAttacking = true;
  this.sprite.setAnimation("attacking");
  var shipY = entityManager._ships[0].cy;
  var shipX = entityManager._ships[0].cx;
  this.angleRadians = Math.atan2(shipY - this.cy, shipX - this.cx);
  this.attackStartX = this.cx;
  this.attackStartY = this.cy;
  this.t = 0.1;
};
