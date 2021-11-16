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
  this.acceleration = 1;

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
    //this.cy += this.velY * du;
    nextY = this.cy + (this.velY * du);
  }

  // Check if this enemy should start attack round
  this.maybeAttack();

  if (this.isAttacking) {
    this.maybeFireBullet();
    this.velY = 1.5;
    nextY = this.cy + (this.velY * du);
  }

  // If enemy is out of bounds reset it
  if(this.cy > g_canvas.height + 100){
    nextY = 0;
    this.isAttacking = false;
    this.velY = this.velYStandard;
  }

  this.cy = nextY;


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
    let probability = util.randRange(0, 5000);
    if (probability < 2) {
      this.isAttacking = true;
    }
  }
}