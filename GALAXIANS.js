/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_youLost = false;
/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

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

// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    // Entity Manager updates all the entities
    entityManager.update(du)
}


// =================
// RENDER SIMULATION
// =================

// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    // Entity Manager renders all the entities
    entityManager.render(ctx);
    
    if(g_youLost) {
        gameOver(ctx)
    }
}


// Kick it off
g_main.init();