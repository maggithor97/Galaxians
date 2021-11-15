"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var g_sceneManager = new SceneManager();

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIP
// ====================

function initialize() {
    g_sceneManager.addScene("scoreTable", g_scoreTableScene);
    g_sceneManager.addScene("menu", g_menuScene);
    g_sceneManager.addScene("game", g_gameScene);

    background.init();

    let offset = (g_sprites.ship.scale * g_sprites.ship.sheetCoords.default.size.h) * 1.5;
    let margin = 4;
    entityManager.generateShip({
        cx: g_canvas.width / 2,
        cy: g_canvas.height - offset - margin,
        scale: g_scale
    });

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

    g_sceneManager.getActiveScene().updateSimulation(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;

var KEY_SPATIAL = keyCode('X');
var KEY_HALT = keyCode('H');
var KEY_RESET = keyCode('R');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

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

    g_sceneManager.getActiveScene().renderSimulation(ctx);

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
            size: { w: 14, h: 14 },
            frames: [[2, 71]]
        },
        explosion: {
            size: { w: 30, h: 30 },
            frames: [[2, 88], [35, 88], [68, 88], [101, 88]]
        }
    });

    // We don't instantiate a Sprite for the aliens here, only populate
    // an array with the sprite data. Instantiation is done in entityManager
    // via the _generateAliens method.
    g_sprites.aliens = [];

    // Alien types 0-2
    for (let i = 0; i < 3; i++) {
        let o = i * 17; // offset
        g_sprites.aliens.push({
            default: {
                size: { w: 14, h: 14 },
                frames: [[53, 2 + o], [2, 2 + o], [53, 2 + o], [19, 2 + o]]
            },
            attacking: {
                size: { w: 14, h: 14 },
                frames: [[70, 2 + o], [87, 2 + o], [104, 2 + o], 
                         [121, 2 + o], [138, 2 + o], [155, 2 + o], 
                         [172, 2 + o], [189, 2 + o]
                        ]
            },
            explosion: {
                size: { w: 14, h: 14 },
                frames: [[62, 71], [79, 71], [96, 71], [113, 71]]
            }}
        );
    }

    // Alien type 3
    g_sprites.aliens.push({
        default: {
            size: { w: 14, h: 14 },
            frames: [[2, 53]]
        },
        attacking: {
            size: { w: 14, h: 14 },
            frames: [[19, 53], [36, 53], [53, 53], 
                     [70, 53], [87, 53], [104, 53] 
                    ]
        },
        explosion: {
            size: { w: 14, h: 14 },
            frames: [[62, 71], [79, 71], [96, 71], [113, 71]]
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