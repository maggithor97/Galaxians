// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.type = "Ship";

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    //this.sprite.scale = this.scale;

    // Set normal drawing scale, and warp state off
    //this._scale = 1;
    //this._isWarping = false;

    this.isExploding = false;
    this.isRespawning = false;
    
    this.respawnInterval = 6 * SECS_TO_NOMINALS;
    this.respawnTimer = 0;

    this.animationInterval = 0.25 * SECS_TO_NOMINALS;
    this.animationTimer = 0;
    this.extraLives = 3;
};

Ship.prototype = new Entity();

Ship.prototype.explosionPlayer = new Audio("sounds/explosionPlayer.wav");
Ship.prototype.explosionPlayer.volume = 0.2;

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

//Ship.prototype.KEY_THRUST = 'W'.charCodeAt(0);
//Ship.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Ship.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 3;
//Ship.prototype.velY = 5;
Ship.prototype.launchVel = 2;
//Ship.prototype.numSubSteps = 1;

// HACKED-IN AUDIO (no preloading)
//Ship.prototype.warpSound = new Audio(
//    "sounds/shipWarp.ogg");
    
Ship.prototype.update = function (du) {
    
    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.animationTimer += du;

    if (this.isRespawning) {
        this.respawnTimer += du;

        if (this.respawnTimer > this.respawnInterval) {
            this.reset();
        }

        return;
    }

    if (this.isExploding) {
        if (this.sprite.frame === this.sprite.numFrames-1) {
            //return entityManager.KILL_ME_NOW;
            this.extraLives -= 1;
            if (this.extraLives <= 0) {
                // Back to menu.
                this.extraLives = 0;
                this.reset();
                g_sceneManager.loadScene("gameover");
            }

            this.isRespawning = true;
            //this.reset();
        }
        return;
      }

    if (keys[this.KEY_LEFT]) {
        let nextX = this.cx - this.velX * du;
        if (nextX > (this.sprite.width / 2))
            this.cx -= this.velX * du;
    }
    if (keys[this.KEY_RIGHT]){
        let nextX = this.cx + this.velX * du;
        if (nextX + (this.sprite.width / 2) < g_canvas.width)
            this.cx += this.velX * du;
    }
    // Handle firing
    this.maybeFireBullet();
   
    spatialManager.register(this);
};

Ship.prototype.maybeFireBullet = function () {

    let bulletHeight = g_sprites.playerBullet.height;
    entityManager.spawnPlayerBullet(this.cx, this.cy - this.getRadius() - bulletHeight);

    if (keys[this.KEY_FIRE]) {

        entityManager.firePlayerBullet();
    
    }
    
};

Ship.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Ship.prototype.takeBulletHit = function (bullet) {
     // Player can't hit itself.
     if (bullet.type === "playerBullet") {
        return;
    }

    entityManager.despawnPlayerBullet();

    this.explosionPlayer.play();
    this.sprite.setAnimation("explosion");
    this.isExploding = true;
    this.animationInterval = 0.10 * SECS_TO_NOMINALS
    
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.sprite.setAnimation("default");
    this.isExploding = false;
    this.isRespawning = false;
    this.respawnTimer = 0;
    // unsure why this is called. I removed it because then the reset function can be used to respawn the player after death.
    //this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Ship.prototype.render = function (ctx) {
    if (this.isRespawning) {
        Text(ctx, "READY", 180, 350, g_fonts.red);
        return;
    }

    this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);

    if (this.animationTimer > this.animationInterval) {
        this.sprite.nextFrame();
        this.animationTimer = 0;
    }
};
