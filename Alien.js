function Alien(descr) {

  this.setup(descr);

  this.type = "Alien";

  this.spriteType = descr.type;
  this.sprite = this.sprite || g_sprites.aliens[this.spriteType];

  this.width = this.sprite.width;
  this.height = this.sprite.height;

  let gapLeftWall = this.width * 2;
  let gapTopWall = this.height * 1.5;
  let gapBetween = this.width / 10;

  this.x = descr.x; // its index in the _aliens_x_position grid in entityManager
  this.originalY = gapTopWall + descr.y * (gapBetween + this.height);
  if(descr.isRespawning == false)
    this.cy = originalY;
  else 
    this.cy = 10;

  this.velY = 0.5;

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

  // Updating x position  
  this.cx = entityManager.getAlienPosition(this.x);
  // Updating y position
  if(this.cy < this.originalY){
    this.cy += this.velY * du;
  }

  if (this.isAttacking) {
    this.maybeFireBullet();
  }

  spatialManager.register(this);
};

Alien.prototype.render = function (ctx) {

  this.sprite.drawCentredAt(ctx, this.cx, this.cy);

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

  let mode = (this.isAttacking) ? "charger" : "convoy";
  scoreManager.increasePlayerScore(mode, this.spriteType);

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