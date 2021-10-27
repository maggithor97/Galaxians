/// NOT in USE


"use strict";

// Here, the fist row has 3 live
var aliens = [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];
var gapFromWall = 40;
var gapBetweenAliens = 7;
var COLUMNS = 8;
var ROWS = 6;

var entityManager = {

    // "PRIVATE" DATA

    _aliens: new Aliens({
        aliens: aliens, // If aliens[i][j]===0 then it's it's dead else it's alive
        alienWidth: Math.floor((document.getElementById("myCanvas").width - (2 * gapFromWall) - ((COLUMNS - 1) * gapBetweenAliens)) / COLUMNS),
        alienHeight: 15,
        rows: ROWS,
        columns: COLUMNS,
        gapBetweenAliens: gapBetweenAliens,     // In px
        gapFromWall: gapFromWall,         // In px
        gapFromTop: 40
    }),

    _bullets: [],
    _ships: [],         // It's an array so we can add more ships if we want



    // PUBLIC METHODS

    // A special return value, used by other objects,
    // to request the blessed release of death!
    //
    KILL_ME_NOW: -1,

    // Some things must be deferred until after initial construction
    // i.e. thing which need `this` to be defined.
    //
    deferredSetup: function () {
        this._categories = [this._bullets, this._ships];
    },

    init: function () {

        // I could have made some ships here too, but decided not to.

        this.generateShip();
    },

    generateShip: function () {
        var ship1 = new Ship({
            cx: g_canvas.width / 2,
            cy: g_canvas.height * 0.90,

            GO_LEFT: KEY_A,
            GO_RIGHT: KEY_D
        });
        this._ships.push(ship1);
    },

    fireBullet: function (cx, cy, velX, velY, rotation) {

        // TODO: Implement this
        var newBullet = new Bullet({
            cx: cx,
            cy: cy,
            velX: velX,
            velY: velY,
            rotation: rotation
        });
        this._bullets.push(newBullet)

    },

    update: function (du) {

        this._categories.forEach(categorie => {
            
            //  Updates bullets and removes dead bullets
            if (categorie === this._bullets) {
                for (var i = 0; i < categorie.length; i++) {
                    var item = categorie[i];
                    item.update(du)
                    if (item.killMe) {
                        this._bullets.splice(i, 1)
                    }
                }
            } else { // Update everything else
                categorie.forEach(item => {
                    item.update(du)
                })
            }
        });
    },

    render: function (ctx) {

        console.log(this._aliens)
        this._aliens.render(ctx);

        this._categories.forEach(categorie => {
            categorie.forEach(item => {
                item.render(ctx)
            })

        });

    }

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();