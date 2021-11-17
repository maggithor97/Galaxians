/*

entityManager.js

A module which handles arbitrary entity-management

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

const LEFT = -1;
const RIGHT = 1;

var entityManager = {

// "PRIVATE" DATA
_aliens   : [],
_aliens_x_position : [],
_aliens_x_direction : LEFT,
_flags : 1,
_alien_grid_types : [],
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

    this._alien_grid_types = alienGridTypes;

    // Fill the _aliens_x_position array with their position
    // This array will then be updated with its x position
    // and then the alien can receive their position from here
    // This saves some computations, but most importantly it 
    // allows for respawning enemies to find their position 
    // even though it is constantly moving
    let alienWidth = 28; // This values are extracted from Alien
    let gapLeftWall = 58;
    let gapBetween = 2.8; 
    for(let j = 0; j  < 10; j++){
        this._aliens_x_position[j] = gapLeftWall + j * (gapBetween + alienWidth); // This formula is taken from the former init in Alien
    }    

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
                isRespawning : false,
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
    this.generateShip();
    this._generateAliens();
},

reset: function() {
    this._flags = 1;
    this.resetShip();
    this.resetAliens();
    this.resetBullets();
    this.deferredSetup();
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

despawnPlayerBullet: function() {
    this._player_bullet.pop();
},

firePlayerBullet: function() {
    this._player_bullet[0].velY = -8;
},

// Return the position of the alien at column number [index].
getAlienPosition : function(index) {
    return this._aliens_x_position[index];
},

// Update all aliens positions
updateAlienPosition : function(du) {
    let velX = 0.5;
    let halfWidth = 14;
    for(let i = 0; i < this._aliens_x_position.length; i++){
        let direction = this.getAliensDirection();
        let nextX = this._aliens_x_position[i] + (velX * direction * du);
        //if (nextX < halfWidth + 30 || nextX > g_canvas.width - halfWidth - 30) {
        //    this.changeAliensDirection();
        //}
        this._aliens_x_position[i] = nextX;
    }

    // Check which column is closest to the left and right
    let alienGrid = this.getAlienGrid();
    let closestLeft = alienGrid[0].length;
    let closestRight = 0;
    for(let col = 0; col < alienGrid[0].length; col++){
        let found = false;
        for(let row = 0; row < alienGrid.length; row++){
            if(alienGrid[row][col] != 0){
                found = true;
                break;
            }
        }
        if(found == true){
            closestLeft = col;
            break;
        }
    }
    for(let col = alienGrid[0].length - 1; col >= 0; col--){
        let found = false;
        for(let row = 0; row < alienGrid.length; row++){
            if(alienGrid[row][col] != 0){
                found = true;
                break;
            }
        }
        if(found == true){
            closestRight = col;
            break;
        }
    }

    // If the enemy most left or most right is close to the border, change enemy directions
    let alienLeftX = this._aliens_x_position[closestLeft];
    let alienRightX = this._aliens_x_position[closestRight];
    let border = 50; 
    if(alienLeftX < border || alienRightX > g_canvas.width - border)
        this.changeAliensDirection();
    //if (nextX < halfWidth + 30 || nextX > g_canvas.width - halfWidth - 30) {
    //    this.changeAliensDirection();
    //}

},

// Get the grid that is used to check if neighbouring aliens is alive
getAlienGrid : function() {
    return this._alien_grid_types;
},

// Set value of grid, is used generally to change values to 0 to indicate dead alien 
setAlienGrid : function(column, row, value) {
    this._alien_grid_types[row][column] = value;
},

getAliensDirection : function() {
    return this._aliens_x_direction;
},

changeAliensDirection : function() {
    this._aliens_x_direction = (this._aliens_x_direction === LEFT) ? RIGHT : LEFT;
},

CHEAT_killAlien: function() {
    this._aliens[0].kill();
},

getFlags : function() {
    return this._flags;
},

getAlien : function(type) {
    let alien = null;

    switch (type) {
        case 1:
            alien = this._aliens[16];
            break;
        case 2:
            alien = this._aliens[8];
            break;
        case 3:
            alien = this._aliens[2];
            break;
        case 4:
            alien = this._aliens[0];
            break;
        default:
            alien = null;
            break;
    }

    return alien;
},

getShipCoords : function() {
    return { x: this._ships[0].cx, y: this._ships[0].cy };
},

getShipLives : function() {
    return this._ships[0].extraLives;
},

generateAlien : function(descr) {
    var newAlien = new Alien(descr);
    //dexcr.x is the column number
    newAlien.sprite.frame = (newAlien.sprite.frame + descr.x) % newAlien.sprite.numFrames;
    this._aliens.push(newAlien);
},

generateShip : function() {
    //this._ships.push(new Ship(descr));
    let offset = (g_sprites.ship.scale * g_sprites.ship.sheetCoords.default.size.h) * 1.5;
    let margin = 4;

    this._ships.push(new Ship({
            cx: g_canvas.width / 2,
            cy: g_canvas.height - offset - margin,
            scale: g_scale
        })
    );
},

resetShip: function() {
    //this._forEachOf(this._ships, Ship.prototype.reset);
    this._ships = [];
    this.generateShip();
},

resetAliens: function() {
    this._aliens = [];
    this._generateAliens();
},

resetBullets: function() {
    this._player_bullet = [];
    this._enemy_bullets = [];
},

update: function(du) {
    //Update enemy position
    this.updateAlienPosition(du);

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

    if (this._aliens.length === 0) {
        this.resetAliens();
        this._flags += 1;
        this.deferredSetup();
        // Go to next level
    }
},

render: function(ctx) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);

        }
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

