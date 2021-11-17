var KEY_SPACE = keyCode(' '); 

g_menuScene = {};

g_menuScene.init = function() {
  scoreManager.reset();
  
  this.animationInterval = SECS_TO_NOMINALS;
  this.animationTimer = 0;
};

g_menuScene.updateSimulation = function (du) {
  this.animationTimer += du;

  background.update(du);

  hud.update(du);

  if (eatKey(KEY_SPACE)) {
    g_sceneManager.loadScene("game");
  }
};

g_menuScene.renderSimulation = function (ctx) {
  background.render(ctx);

  if (this.animationTimer > 2 * this.animationInterval) {
    Text(ctx, "WE ARE THE GALAXIANS", 90, 150, g_fonts.red);
  }

  if (this.animationTimer > 3 * this.animationInterval) {
    Text(ctx, "MISSION - DESTROY ALL ALIENS", 40, 170, g_fonts.red);
  }

  if (this.animationTimer > 4 * this.animationInterval) {
    Text(ctx, "- SCORE ADVANCE TABLE -", 70, 240, g_fonts.white);
  }

  if (this.animationTimer > 5 * this.animationInterval) {
    Text(ctx, "CONVOY CHARGER", 120, 260, g_fonts.blue);
  }

  if (this.animationTimer > 6 * this.animationInterval) {
    let alien = entityManager.getAlien(4).sprite.drawCentredAt(ctx, 90, 290);
    
    Text(ctx, "60", 145, 290, g_fonts.blue);
    Text(ctx, "200", 240, 290, g_fonts.blue);

    Text(ctx, "PTS", 300, 290, g_fonts.blue);
  }

  if (this.animationTimer > 7 * this.animationInterval) {

    let alien = entityManager.getAlien(3).sprite.drawCentredAt(ctx, 90, 320);
    
    Text(ctx, "50", 145, 320, g_fonts.blue);
    Text(ctx, "100", 240, 320, g_fonts.blue);
    Text(ctx, "PTS", 300, 320, g_fonts.blue);
  }

  if (this.animationTimer > 8 * this.animationInterval) {
    let alien = entityManager.getAlien(2).sprite.drawCentredAt(ctx, 90, 350);
    
    Text(ctx, "40", 145, 350, g_fonts.blue);
    Text(ctx, "80", 250, 350, g_fonts.blue);

    Text(ctx, "PTS", 300, 350, g_fonts.blue);
  }

  if (this.animationTimer > 9 * this.animationInterval) {
    let alien = entityManager.getAlien(1).sprite.drawCentredAt(ctx, 90, 380);
    
    Text(ctx, "30", 145, 380, g_fonts.blue);
    Text(ctx, "60", 250, 380, g_fonts.blue);

    Text(ctx, "PTS", 300, 380, g_fonts.blue);
  }

  if (this.animationTimer > 11 * this.animationInterval) {
    Text(ctx, "PRESS", 100, 430, g_fonts.white);
    Text(ctx, " SPACE ", 166, 430, g_fonts.blue);
    Text(ctx, "TO PLAY", 258, 430, g_fonts.white);
  }

  hud.render(ctx);
  /*
  ctx.save();

  ctx.font = '48px monospace';
  let title = "Galaxian";
  let textMeasure = ctx.measureText(title);
  let x = (g_canvas.width - textMeasure.width) / 2;
  ctx.fillText(title, x, 150);

  ctx.font = "16px monospace";
  let subtitle = "press SPACE to play";
  textMeasure = ctx.measureText(subtitle);
  x = (g_canvas.width - textMeasure.width) / 2;
  ctx.fillText(subtitle, x, 200);
  
  ctx.restore();
  */
};
