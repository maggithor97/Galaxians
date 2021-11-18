// ====
// Starfield
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Starfield(descr) {

  for (var property in descr) {
    this[property] = descr[property];
  }

  // Default sprite and scale, if not otherwise specified
  this.scale  = this.scale  || 1;
  this.randomizeRGBInterval = 1 * SECS_TO_NOMINALS;
  this.randomizeRGBTimer = 0;
  this.cy = 0;
/*
    // Diagnostics to check inheritance stuff
    this._StarfieldProperty = true;
    console.dir(this);
*/

};

Starfield.prototype.getRGB = function () {
  //let rgbs = [0, 0, 0, 127, 127, 127, 127, 255, 255, 255];
  // reference: https://www.color-hex.com/color-palette/65748
  let rgbs = [[255, 52, 52], [226, 255, 73], [34, 255, 71], [21, 53, 212]];
  return rgbs[util.randRange(0, rgbs.length)];
};

Starfield.prototype.init = function (du) {
  this.sprite = g_ctx.createImageData(g_canvas.width, g_canvas.height);

  this.numPixels = g_canvas.width * g_canvas.height;

  // createImageData initializes all the pixels to rgba=0,0,0,0.
  // So we set all the pixels alpha values to max.
  for (let i = 0; i < this.numPixels; i++) {
    this.sprite.data[4 * i + 3] = 255;
  }

  this.stars = [];
  
  // We just pick a random pixel from the imagedata and
  // give it either 0, 127 or 255 as rgb values.
  // That is dark, faint or bright star.
  for (let i = 0; i < this.numStars; i++) {
    let rgb = this.getRGB();

    let pixel = util.randRange(0, this.numPixels + 1);
    this.stars.push(pixel);
    
    this.sprite.data[4 * pixel + 0] = rgb[0];
    this.sprite.data[4 * pixel + 1] = rgb[1];
    this.sprite.data[4 * pixel + 2] = rgb[2];
    this.sprite.data[4 * pixel + 3] = 255;
  }
};

Starfield.prototype.randomizeRGB = function () {
  for (let i = 0; i < this.stars.length; i++) {
    let px = this.stars[i];
    let rgb = this.getRGB();
    this.sprite.data[4 * px + 0] = rgb[0];
    this.sprite.data[4 * px + 1] = rgb[1];
    this.sprite.data[4 * px + 2] = rgb[2];
  }
};

Starfield.prototype.update = function (du) {

  this.cy += this.velY * du;
  this.cy = util.wrapRange(this.cy, 0, g_canvas.height);

  this.randomizeRGBTimer += du;
    
};

Starfield.prototype.render = function (ctx) {
  var origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
  this.sprite.scale = this.scale;

  if (this.randomizeRGBTimer > this.randomizeRGBInterval) {
    this.randomizeRGB();
    this.randomizeRGBTimer = 0;
  }

  ctx.putImageData(this.sprite, 0, this.cy);
  ctx.putImageData(this.sprite, 0, this.cy - g_canvas.height);
  ctx.putImageData(this.sprite, 0, this.cy + g_canvas.height);
};

let background = new Starfield({
  cy : 0,
  velY : 1,
  numStars : 100,
  scale : g_scale
});