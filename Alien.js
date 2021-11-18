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

  this.column = descr.x; // its index in the _aliens_x_position grid in entityManager
  this.row    = descr.y;
  this.originalY = gapTopWall + descr.y * (gapBetween + this.height);

  if(descr.isRespawning == false)
    this.cy = this.originalY;
  else 
    this.cy = 10;

  this.velYStandard = 0.5;
  this.velY = 0.5;
  this.acceleration = 0;
  this.maxAcceleration = 3;
  this.sidePush = 2;
  this.velX = 0.1;
  this.accelerationY = 0;
  this.dir = 1;

  this.animationInterval = 0.25 * SECS_TO_NOMINALS;
  this.animationTimer = 0;
  this.isExploding = false;
  this.isAttacking = false;
  this.isRotated = false;
  this.animationFreeze = false;
  this.rotation = 0;
  this.loopCount = 0; 

};

Alien.prototype = new Entity();

Alien.prototype.explosionAlien = new Audio("sounds/explosionAlien.wav");
Alien.prototype.explosionAlien.volume = 0.2;
Alien.prototype.attackingAlien = new Audio("sounds/attackingAlien.wav");
Alien.prototype.attackingAlien.volume = 0.2;

Alien.prototype.update = function (du) {
  spatialManager.unregister(this);

  if (this._isDeadNow) return entityManager.KILL_ME_NOW;

  if(this.animationFreeze == false)
    this.animationTimer += du;

  if (this.isExploding) {
    if (this.sprite.frame === this.sprite.numFrames-1) {
      entityManager.setAlienGrid(this.column, this.row, 0); // remove enemy from grid
      return entityManager.KILL_ME_NOW;
    }
    return;
  }

  let nextY = this.cy;
  // Updating x position 
  if(this.isAttacking == false) 
    this.cx = entityManager.getAlienPosition(this.column);
  // Updating y position
  if(this.cy < this.originalY){
    nextY = this.cy + (this.velY * du);
  }

  // Check if this enemy should start attack round
  if(this.isExploding == false)
    this.maybeAttack();

  if (this.isAttacking) {
    this.attackingAlien.play();
    // Animation, if the attack animation has gone through all frames ONCE
    // the sprite should be rotated by 90 degrees, and then played again ONCE
    if (this.sprite.frame === 0 && this.loopCount == 1){
      this.loopCount = 2;
      this.rotation = 90 * Math.PI / 180;
      this.isRotated = true;
    }
    if (this.sprite.frame === this.sprite.numFrames-1){
      if(this.loopCount == 0)
        this.loopCount = 1;
      if(this.loopCount == 2){
        this.animationFreeze = true;
      }
      // rotate by 90 degrees
    }
    
    this.maybeFireBullet();
    this.velY = 1.5;

    this.accelerationY += 0.1;
    if(this.accelerationY > 1.5)
      this.accelerationY = 1.5;
    nextY = this.cy + (this.accelerationY * du);

    // Move enemy to the side, with friction
    // The alien is not allowed to change direction from the start when driving upwards
    if(this.accelerationY == 1.5){
      this.dir = 1
      if(this.cx > entityManager.getShipCoords().x)
        this.dir = -1;
    }
    
    this.acceleration += this.velX * this.dir;

    if(this.acceleration > this.maxAcceleration)
      this.acceleration = this.maxAcceleration;
    if(this.acceleration < - this.maxAcceleration)
      this.acceleration = - this.maxAcceleration;

    this.cx += this.acceleration * du;

    let hitEntity = this.isColliding();

    if (hitEntity && hitEntity.type === "Ship") {
      //this.kill();
      this.takeBulletHit({ type: "playerBullet" });
      hitEntity.takeBulletHit({ type: "enemyBullet" });
    }
  }

  // If enemy is out of bounds reset it
  if(this.cy > g_canvas.height + 100){
    nextY = -20;
    this.isAttacking = false;
    this.velY = this.velYStandard;
    this.sprite.setAnimation("default");
    if(this.isRotated){
      this.isRotated = false;
      this.animationFreeze = false;
      this.loopCount = 0;
      this.rotation = 0;
      // Rotate back by 90 degres counter clockwise!
    }
  }

  this.cy = nextY;

  spatialManager.register(this);
};

Alien.prototype.render = function (ctx) {

  this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);

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

  this.explosionAlien.play();
  this.sprite.setAnimation("explosion");
  this.isExploding = true;
  this.isAttacking = false;
  this.animationFreeze = false;
  this.rotation = 0;
  this.animationInterval = 0.10 * SECS_TO_NOMINALS
};


Alien.prototype.maybeFireBullet = function () {
  let probability = util.randRange(0, 200);
  let bulletSpeed = 3;
  if (probability < 2) {
    entityManager.fireEnemyBullet(this.cx, this.cy + this.sprite.height / 2, bulletSpeed)
  }
};

// Checks the condition for initiatng an attack
// The conditions are: The alien should not have any neighbours in one direction
Alien.prototype.maybeAttack = function() {
  let alienGrid = entityManager.getAlienGrid();
  let leftNeighboursDead = true;
  let rightNeighboursDead = true;
  // Check that all enemies to the left is dead
  for(let i = 0; i < this.column; i++){
    if(alienGrid[this.row][i] != 0){
      leftNeighboursDead = false
      break;
    }
  }
  // Check that all enemies to the right is dead
  for(let i = alienGrid[this.row].length - 1; i > this.column; i--){
    if(alienGrid[this.row][i] != 0){
      rightNeighboursDead = false
      break;
    }
  }

  if(this.column == 0 ||  this.column == alienGrid[0].length -1 || leftNeighboursDead || rightNeighboursDead){
    let prob = entityManager.getPhaseProbability();
    let probability = util.randRange(0, prob); //former 5000
    if (probability < 2) {
      this.sprite.setAnimation("attacking");
      this.isAttacking = true;
      this.accelerationY = -2;
      this.dir = 1;
      this.acceleration = this.sidePush;
      if(leftNeighboursDead)
        this.acceleration = - this.sidePush;
        this.dir = -1;
    }
  }
}