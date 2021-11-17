"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_sceneManager = new SceneManager();
var scoreManager = new ScoreManager({});

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIP
// ====================

function initialize() {

    g_sceneManager.addScene("menu", g_menuScene);
    g_sceneManager.addScene("game", g_gameScene);
    g_sceneManager.addScene("gameover", g_gameOverScene);

    g_sceneManager.loadScene("menu");

    scoreManager.addToScoreTable("charger", 200);
    scoreManager.addToScoreTable("charger", 100);
    scoreManager.addToScoreTable("charger", 80);
    scoreManager.addToScoreTable("charger", 60);

    scoreManager.addToScoreTable("convoy", 60);
    scoreManager.addToScoreTable("convoy", 50);
    scoreManager.addToScoreTable("convoy", 40);
    scoreManager.addToScoreTable("convoy", 30);

    background.init();

    entityManager.init();

    hud.init();
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
var KEY_RESET = keyCode('R');
var CHEAT_KILL_ALIEN = keyCode('K');

function processDiagnostics() {

    if (eatKey(CHEAT_KILL_ALIEN)) entityManager.CHEAT_killAlien();

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_RESET)) entityManager.resetShip();

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
            frames: [[2, 70]]
        },
        explosion: {
            size: { w: 30, h: 30 },
            frames: [[2, 88], [35, 88], [68, 88], [101, 88]]
        }
    });

    g_sprites.lives = new Sprite(g_images.sheet, g_scale * 0.75, {
        default: {
            size: { w: 14, h: 14 },
            frames: [[19, 70]]
        }
    });

    g_sprites.flag = new Sprite(g_images.sheet, g_scale, {
        default: {
            size: { w: 8, h: 14 },
            frames: [[35, 70]]
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
                         [121, 2 + o], [138, 2 + o], [155, 2 + o]
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

    g_sprites.playerBullet = new Sprite(g_images.sheet, g_scale * 1.5, {
        default: {
            size: { w: 1, h: 3 },
            frames: [[66, 196]]
        }
    });

    g_sprites.enemyBullet = new Sprite(g_images.sheet, g_scale * 1.5, {
        default: {
            size: { w: 1, h: 3 },
            frames: [[139, 196]]
        }
    });
}

let g_fonts = {};
let g_font_size = [7 * g_scale * 0.75, 7 * g_scale * 0.75]

function loadFonts() {
    g_fonts.white = {
        "0": [2, 120], "1": [11, 120], "2": [20, 120], "3": [29, 120], "4": [38, 120], 
        "5": [47, 120], "6": [56, 120], "7": [65, 120], "8": [74, 120], "9": [83, 120], 
        "A": [92, 120], "B": [101, 120], "C": [110, 120], "D": [119, 120], "E": [128, 120], 
        "F": [137, 120], "G": [146, 120], "H": [155, 120], "I": [164, 120], "J": [2, 129], 
        "K": [11, 129], "L": [20, 129], "M": [29, 129], "N": [38, 129], "O": [47, 129], 
        "P": [56, 129], "Q": [65, 129], "R": [74, 129], "S": [83, 129], "T": [92, 129], 
        "U": [101, 129], "V": [110, 129], "W": [119, 129], "X": [128, 129], "Y": [137, 129], 
        "Z": [146, 129], "-": [155, 129],
        "size": g_font_size
    }

    g_fonts.red = {
        "0": [2, 138], "1": [11, 138], "2": [20, 138], "3": [29, 138], "4": [38, 138], 
        "5": [47, 138], "6": [56, 138], "7": [65, 138], "8": [74, 138], "9": [83, 138], 
        "A": [92, 138], "B": [101, 138], "C": [110, 138], "D": [119, 138], "E": [128, 138], 
        "F": [137, 138], "G": [146, 138], "H": [155, 138], "I": [164, 138], "J": [2, 147], 
        "K": [11, 147], "L": [20, 147], "M": [29, 147], "N": [38, 147], "O": [47, 147], 
        "P": [56, 147], "Q": [65, 147], "R": [74, 147], "S": [83, 147], "T": [92, 147], 
        "U": [101, 147], "V": [110, 147], "W": [119, 147], "X": [128, 147], "Y": [137, 147], 
        "Z": [146, 147], "-": [155, 147],
        "size": g_font_size
    }

    g_fonts.blue = {
        "0": [2, 156], "1": [11, 156], "2": [20, 156], "3": [29, 156], "4": [38, 156], 
        "5": [47, 156], "6": [56, 156], "7": [65, 156], "8": [74, 156], "9": [83, 156], 
        "A": [92, 156], "B": [101, 156], "C": [110, 156], "D": [119, 156], "E": [128, 156], 
        "F": [137, 156], "G": [146, 156], "H": [155, 156], "I": [164, 156], "J": [2, 165], 
        "K": [11, 165], "L": [20, 165], "M": [29, 165], "N": [38, 165], "O": [47, 165], 
        "P": [56, 165], "Q": [65, 165], "R": [74, 165], "S": [83, 165], "T": [92, 165], 
        "U": [101, 165], "V": [110, 165], "W": [119, 165], "X": [128, 165], "Y": [137, 165], 
        "Z": [146, 165], "-": [155, 165],
        "size": g_font_size
    }
}

function preloadDone() {

    loadSprites();

    loadFonts();

    initialize();

    main.init();
}

// Kick it off
requestPreloads();