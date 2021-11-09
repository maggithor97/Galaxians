"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIP
// ====================

function initialize() {

    background.init();

    let offset = (g_sprites.ship.scale * g_sprites.ship.sheetCoords.default.size.h) * 1.5;
    let margin = 4;
    entityManager.generateShip({
        cx: g_canvas.width / 2,
        cy: g_canvas.height - offset - margin,
        scale: g_scale
    });

    /*
    var aliens = [
        [3, 3, 3, 3, 3, 3, 3, 3],
        [2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1]
    ];
    var gapFromWall = 40;
    var gapBetweenAliens = 15;
    var COLUMNS = 5;
    var ROWS = 5;
    entityManager.generateAliens({
        aliens: aliens, // If aliens[i][j]===0 then it's it's dead else it's alive
        alienWidth: Math.floor((document.getElementById("myCanvas").width - (2 * gapFromWall) - ((COLUMNS - 1) * gapBetweenAliens)) / COLUMNS),
        alienHeight: 25,
        rows: ROWS,
        columns: COLUMNS,
        gapBetweenAliens: gapBetweenAliens,     // In px
        gapFromWall: gapFromWall,         // In px
        gapFromTop: 40,
        goingLeft: false
    }
    )
    */
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    background.update(du);
    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx: g_mouseX,
        cy: g_mouseY,

        sprite: g_sprites.ship
    });

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx: g_mouseX,
        cy: g_mouseY,

        sprite: g_sprites.ship2
    });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    background.render(ctx);
    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        sheet: "./images/spritesheet_tp.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function loadSprites() {
    g_sprites.ship = new Sprite(g_images.sheet, g_scale, {
        default: {
            size: { w: 16, h: 16 },
            frames: [[1, 70]]
        },
        explosion: {
            size: { w: 32, h: 32 },
            frames: [[1, 87], [34, 87], [67, 87], [100, 87]]
        }
    });

    /*
    g_sprites.alien1 = new Sprite(g_images.sheet, g_scale, {
        default: {
            size: { w: 16, h: 16 },
            frames: [[1, 1], [18, 1], [35, 1], [52, 1]]
        },
        attacking: {
            size: { w: 16, h: 16 },
            frames: [[69, 1], [86, 1], [103, 1], [120, 1], [137, 1], [154, 1], [171, 1], [188, 1]]
        },
        explosion: {
            size: { w: 16, h: 16 },
            frames: [[61, 70], [78, 70], [95, 70], [112, 70]]
        }

    });
    */

    // We don't instantiate a Sprite for the aliens here, only populate
    // an array with the sprite data. Instantiation is done in entityManager
    // via the _generateAliens method.
    g_sprites.aliens = [];

    // Alien types 0-2
    for (let i = 0; i < 3; i++) {
        let o = i * 17; // offset
        g_sprites.aliens.push({
            default: {
                size: { w: 16, h: 16 },
                frames: [[1, 1 + o], [18, 1 + o], [35, 1 + o], [52, 1 + o]]
            },
            attacking: {
                size: { w: 16, h: 16 },
                frames: [[69, 1 + o], [86, 1 + o], [103, 1 + o], 
                         [120, 1 + o], [137, 1 + o], [154, 1 + o], 
                         [171, 1 + o], [188, 1 + o]
                        ]
            },
            explosion: {
                size: { w: 16, h: 16 },
                frames: [[61, 70], [78, 70], [95, 70], [112, 70]]
            }}
        );
    }

    // Alien type 3
    g_sprites.aliens.push({
        default: {
            size: { w: 16, h: 16 },
            frames: [[1, 52]]
        },
        attacking: {
            size: { w: 16, h: 16 },
            frames: [[18, 52], [35, 52], [52, 52], 
                     [69, 52], [86, 52], [103, 52] 
                    ]
        },
        explosion: {
            size: { w: 16, h: 16 },
            frames: [[61, 70], [78, 70], [95, 70], [112, 70]]
        }}
    );

    g_sprites.playerBullet = new Sprite(g_images.sheet, g_scale, {
        default: {
            size: { w: 1, h: 3 },
            frames: [[66, 196]]
        }
    });

    g_sprites.enemyBullet = new Sprite(g_images.sheet, g_scale, {
        default: {
            size: { w: 1, h: 3 },
            frames: [[139, 196]]
        }
    });
    //g_sprites.bullet.scale = 0.25;
}

function preloadDone() {

    loadSprites();

    entityManager.init();

    initialize();

    main.init();
}

// Kick it off
requestPreloads();