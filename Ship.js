// A generic constructor which accepts an arbitrary descriptor object
function Ship(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.

Ship.prototype.halfWidth = 50;
Ship.prototype.halfHeight = 10;

Ship.prototype.update = function (du) {
    if (g_keys[this.GO_LEFT] && 
        this.cx > this.halfWidth) {
        this.cx -= 5 * du;
    } else if (g_keys[this.GO_RIGHT] &&
                this.cx < g_canvas.width - this.halfWidth) {
        this.cx += 5 * du;
    }
};

Ship.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    if (!g_images.shipPicture) {
        var oldStyle = ctx.fillStyle;
        ctx.fillStyle = "#FFF338";
        ctx.fillRect(this.cx - this.halfWidth,
            this.cy - this.halfHeight,
            this.halfWidth * 2,
            this.halfHeight * 2);
        ctx.fillStyle = oldStyle
    } else {
        ctx.drawImage(g_images.shipPicture,
            this.cx - this.halfWidth,
            this.cy - this.halfHeight,
            this.halfWidth * 2,
            this.halfHeight * 2);
    }

};


Ship.prototype.collidesWith = function (prevX, prevY,
    nextX, nextY, r) {
    var shipMiddle = this.cx;
    // Check Y coords
    if (nextY + r >= this.cy - this.halfHeight &&
        nextY - r <= this.cy + this.halfHeight) {
        // Check X coords
        if ((nextX <= shipMiddle + this.halfWidth &&
            nextX >= shipMiddle - this.halfWidth)) {
            // It's a hit!
            return true;
        }
    }
    // It's a miss!
    return false;
};


// ==============
// MOUSE HANDLING
// ==============
/*
function handleMouse(evt) {

    // If no button is being pressed, then ignore
    if (!evt.which) return;

    var x = evt.clientX - g_canvas.offsetLeft;
    if (x > g_canvas.width - g_ship1.halfWidth) {
        g_ship1.cx = g_canvas.width - g_ship1.halfWidth;
    } else if (x < g_ship1.halfWidth) {
        g_ship1.cx = g_ship1.halfWidth;
    } else {
        g_ship1.cx = x;
    }
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse);
*/