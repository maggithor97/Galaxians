g_gameOverScene = {};

g_gameOverScene.init = function() {
  this.animationInterval = 4 * SECS_TO_NOMINALS;
  this.animationTimer = 0;
};

g_gameOverScene.updateSimulation = function (du) {
  this.animationTimer += du;

  background.update(du);

  hud.update(du);

  if (this.animationTimer > this.animationInterval) {
    g_sceneManager.loadScene("menu");
  }
};

g_gameOverScene.renderSimulation = function (ctx) {
  background.render(ctx);

  Text(ctx, "GAME OVER", 160, 250, g_fonts.red);

  hud.render(ctx);
};