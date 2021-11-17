// ====
// Hud
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Hud(descr) {

  for (var property in descr) {
    this[property] = descr[property];
  }

  // Default sprite and scale, if not otherwise specified
  this.scale = this.scale || 1;

  this.lives = 0;
  this.flags = 1;
  this.score = "00";
  this.highscore = "00";
  
};


Hud.prototype.init = function (du) {
  this.livesSprite = g_sprites.lives;
  this.flagSprite = g_sprites.flag;
};

Hud.prototype.update = function (du) {
  this.score = scoreManager.getPlayerScore();
  this.highscore = scoreManager.getHighScore();
  this.lives = entityManager.getShipLives();
  this.flags = entityManager.getFlags();
};

Hud.prototype.renderScore = function (ctx) {
  Text(ctx, "1UP   HIGH SCORE", 25, 5, g_fonts.white);
  Text(ctx, `  ${this.score}        ${this.highscore}`, 25, 21, g_fonts.red);
};

Hud.prototype.renderLives = function (ctx) {
  let livesOffsetX = 10;
  let livesOffsetY = 2;
  let lx = this.livesSprite.width / 2 + livesOffsetX;
  let ly = g_canvas.height - this.livesSprite.height / 2 - livesOffsetY;

  for (let i = 1; i < this.lives; i++) {
    this.livesSprite.drawCentredAt(ctx, lx * i, ly, 0);
  }
};

Hud.prototype.renderFlags = function (ctx) {
  let flagOffsetX = 10;
  let flagOffsetY = 2;
  
  for (let i = this.flags; i > 0; i--) {
    let fx = g_canvas.width - (i * this.flagSprite.width) - flagOffsetX;
    let fy = g_canvas.height - this.flagSprite.height / 2 - flagOffsetY;
    this.flagSprite.drawCentredAt(ctx, fx, fy, 0);
  }
};

Hud.prototype.render = function (ctx) {

  this.renderScore(ctx);
  this.renderLives(ctx);
  this.renderFlags(ctx);

};

let hud = new Hud({
  scale : g_scale
});