var g_gameScene = {};
// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`

g_gameScene.init = function (firstInit = false) {
  spatialManager.reset();
  entityManager.reset();
}

// GAME-SPECIFIC UPDATE LOGIC

g_gameScene.updateSimulation = function (du) {
  background.update(du);
  entityManager.update(du);
  hud.update(du);
  // Prevent perpetual firing!
  eatKey(Ship.prototype.KEY_FIRE);
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

g_gameScene.renderSimulation = function (ctx) {
  background.render(ctx);
  entityManager.render(ctx);
  hud.render(ctx);
}