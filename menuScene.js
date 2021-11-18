var KEY_SPACE = keyCode(' '); 

g_menuScene = {};

g_menuScene.init = function() {
  scoreManager.reset();
  
  this.animationInterval = SECS_TO_NOMINALS;
  this.animationTimer = 0;
  this.bossRandomScoreTimer = 0;

  this.ready = false;
};

g_menuScene.updateSimulation = function (du) {
  this.animationTimer += du;
  this.bossRandomScoreTimer += du;

  background.update(du);

  hud.update(du);

  if (this.ready && eatKey(KEY_SPACE)) {
    g_sceneManager.loadScene("game");
  }
};

g_menuScene.renderSimulation = function (ctx) {
  background.render(ctx);

  if (this.bossRandomScoreTimer > 0.25 * this.animationInterval && !this.ready) {
    scoreManager.setRandomBossScore();
    this.bossRandomScoreTimer = 0;
  }

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
    //let alien = entityManager.getAlien(4).sprite.drawCentredAt(ctx, 90, 290);
    drawCentredAt(ctx, 90, 290, 4);
    
    //Text(ctx, "60", 145, 290, g_fonts.blue);
    Text(ctx, scoreManager.getFromScoreTable("convoy", 3).toString(), 145, 290, g_fonts.blue);
    Text(ctx, scoreManager.getFromScoreTable("charger", 3).toString(), 240, 290, g_fonts.blue);

    Text(ctx, "PTS", 300, 290, g_fonts.blue);
  }

  if (this.animationTimer > 7 * this.animationInterval) {

    //let alien = entityManager.getAlien(3).sprite.drawCentredAt(ctx, 90, 320);
    drawCentredAt(ctx, 90, 320, 1);
    
    Text(ctx, scoreManager.getFromScoreTable("convoy", 0).toString(), 145, 320, g_fonts.blue);
    Text(ctx, scoreManager.getFromScoreTable("charger", 0).toString(), 240, 320, g_fonts.blue);
    Text(ctx, "PTS", 300, 320, g_fonts.blue);
  }

  if (this.animationTimer > 8 * this.animationInterval) {
    //let alien = entityManager.getAlien(2).sprite.drawCentredAt(ctx, 90, 350);
    drawCentredAt(ctx, 90, 350, 2);
    
    Text(ctx, scoreManager.getFromScoreTable("convoy", 1).toString(), 145, 350, g_fonts.blue);
    Text(ctx, scoreManager.getFromScoreTable("charger", 1).toString(), 250, 350, g_fonts.blue);

    Text(ctx, "PTS", 300, 350, g_fonts.blue);
  }

  if (this.animationTimer > 9 * this.animationInterval) {
    //let alien = entityManager.getAlien(1).sprite.drawCentredAt(ctx, 90, 380);
    drawCentredAt(ctx, 90, 380, 3);
    
    Text(ctx, scoreManager.getFromScoreTable("convoy", 2).toString(), 145, 380, g_fonts.blue);
    Text(ctx, scoreManager.getFromScoreTable("charger", 2).toString(), 250, 380, g_fonts.blue);

    Text(ctx, "PTS", 300, 380, g_fonts.blue);
  }

  if (this.animationTimer > 11 * this.animationInterval) {
    this.ready = true;

    Text(ctx, "PRESS", 100, 430, g_fonts.white);
    Text(ctx, " SPACE ", 166, 430, g_fonts.blue);
    Text(ctx, "TO PLAY", 258, 430, g_fonts.white);
  }

  hud.render(ctx);

};

function drawCentredAt(ctx, cx, cy, alienType) {
  let scale = g_scale;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  
  const {w, h} = g_sprites.aliens[alienType - 1].default.size;
  let [sx, sy] = g_sprites.aliens[alienType - 1].default.frames[0];
  
  ctx.drawImage(g_images.sheet, 
                  sx, sy, 
                  w, h, 
                  -w/2, -h/2,
                  w, h);
  
  ctx.restore();
}
