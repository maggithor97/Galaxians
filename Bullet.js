// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    //this.fireSound.volume = 0.2;
    //this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.laserAlien = new Audio("sounds/laserAlien.wav");
Bullet.prototype.laserAlien.volume = 0.2;
Bullet.prototype.laserPlayer = new Audio("sounds/laserPlayer.wav");
Bullet.prototype.laserPlayer.volume = 0.2;

// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
//Bullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    if (this.cy < 0 || this.cy > g_canvas.height) return entityManager.KILL_ME_NOW;

    if (this.velY === 0) {
        let shipCoord = entityManager.getShipCoords();
        this.cx = shipCoord.x;
        return;
    }
    
    this.cy += this.velY * du;

    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;

        if (canTakeHit && 
            this.type === "enemyBullet" && 
            hitEntity.type === "Ship") {

            hitEntity.takeBulletHit(this);
            this.kill();
        }

        if (canTakeHit && 
            this.type === "playerBullet" && 
            hitEntity.type === "Alien") {
                
            hitEntity.takeBulletHit(this);
            this.kill();
        }
    }

    spatialManager.register(this);

};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
};

Bullet.prototype.render = function (ctx) {

    if (this.type === "playerBullet") {
        g_sprites.playerBullet.drawCentredAt(
            ctx, this.cx, this.cy, this.rotation
        );
    }
    
    if (this.type === "enemyBullet") {
        g_sprites.enemyBullet.drawCentredAt(
            ctx, this.cx, this.cy, this.rotation
        );
    }

    ctx.globalAlpha = 1;
};
