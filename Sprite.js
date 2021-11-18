// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image, scale, sheetCoords) {
    this.image = image;
    this.sheetCoords = sheetCoords;

    this.scale = scale;
    this.setAnimation("default");

    this.width = this.activeAnimation.size.w * this.scale;
    this.height = this.activeAnimation.size.h * this.scale;

}

Sprite.prototype.scale = g_scale;

Sprite.prototype.nextFrame = function () {
    this.frame = (this.frame + 1) % this.numFrames;
};

Sprite.prototype.setAnimation = function (name) {
    this.activeAnimation = this.sheetCoords[name];
    this.numFrames = this.activeAnimation.frames.length;
    this.width = this.activeAnimation.size.w * this.scale;
    this.height = this.activeAnimation.size.h * this.scale;
    this.frame = 0;
};

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image, 
                  x, y);
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    const {w, h} = this.activeAnimation.size;
    let [sx, sy] = this.activeAnimation.frames[this.frame];
    
    ctx.drawImage(this.image, 
                    sx, sy, 
                    w, h, 
                    -w/2, -h/2,
                    w, h);
    
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};
