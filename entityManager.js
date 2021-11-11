/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/

// Here, the fist row has 3 live


var entityManager = {

// "PRIVATE" DATA
_aliens   : [],
_enemy_bullets : [],
_ships   : [],
_player_bullet : [],

// "PRIVATE" METHODS

_generateAliens : function() {

    let alienGridTypes = [
        [0, 0, 0, 4, 0, 0, 4, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    ];

    for (let i = 0; i < alienGridTypes.length; i++) {
        let row = alienGridTypes[i];

        for (let j = 0; j < row.length; j++) {
            let type = row[j];
            if (type === 0) continue;

            this.generateAlien({
                x : j,
                y : i,
                type : type - 1,
                scale : g_scale,
                sprite : new Sprite(g_images.sheet, g_scale, g_sprites.aliens[type - 1])
            });
        }
    }
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._aliens, this._enemy_bullets, this._ships, this._player_bullet];
},

init: function() {
    this._generateAliens();
    //this._generateShip();
},

fireEnemyBullet: function(cx, cy, velY) {
    this._enemy_bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velY : velY,
        type : "enemyBullet"
    }));
},

spawnPlayerBullet: function(cx, cy) {
    // Spawn a new bullet only if the last one is dead.
    if (this._player_bullet.length > 0) return;

    this._player_bullet.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velY : 0,
        type : "playerBullet"
    }));
},

firePlayerBullet: function() {
    this._player_bullet[0].velY = -5;
},

getShipCoords : function() {
    return { x: this._ships[0].cx, y: this._ships[0].cy };
},

generateAlien : function(descr) {
    var newAlien = new Alien(descr);
    //dexcr.x is the column number
    newAlien.sprite.frame = (newAlien.sprite.frame + descr.x) % newAlien.sprite.numFrames;
    this._aliens.push(newAlien);
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

/*
generateAliens: function(descr) {
    this._aliens = new Aliens(descr)
    console.log(this._aliens)
},
*/

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
    
    //this._aliens.update(du);
    //if (this._rocks.length === 0) this._generateRocks();

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
    //this._aliens.render(ctx)
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

