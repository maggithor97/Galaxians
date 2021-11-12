// ==========
// Alien STUFF
// ==========
function Aliens(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.animationInterval = 0.25 * SECS_TO_NOMINALS;
    this.animationTimer = 0;
}

var flying = 0;

Aliens.prototype.update = function (du) {
    this.animationTimer += du;
}

Aliens.prototype.render = function (ctx) {
    if(this.goingLeft) {
        this.gapFromWall -= 1;
        if(this.gapFromWall < 25) {
            this.goingLeft = false;
        }
    } else {
        this.gapFromWall += 1;
        if(this.gapFromWall >= g_canvas.width*0.25) {
            this.goingLeft = true;
        }
    }

   
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            if (this.aliens[i][j]) {
                var y = this.gapFromTop + (i * (this.gapBetweenAliens + this.alienHeight));
                var x = this.gapFromWall + (j * (this.gapBetweenAliens + this.alienWidth))
                var spriteCOL;
                switch (this.aliens[i][j]) {
                    case 1:
                        spriteCOL = 4;
                        break;
                    case 2:
                        spriteCOL = 3;
                        break;
                    case 3:
                        spriteCOL = 2;
                        break;
                }
                g_sprites.alien1.drawWrappedCentredAt(ctx, x, y);
                if (this.animationTimer > this.animationInterval) {
                    g_sprites.alien1.nextFrame();
                    this.animationTimer = 0;
                }
            }
        }
    }
}

/**
 * Takes in the position of the ball and
 * changes the velisity of the ball if it hits a alien
 */
Aliens.collideDetection = function (prevX, prevY,
    nextX, nextY, r, ball) {
    // What alien is the ball hitting.. if any
    var i = Math.floor((nextY - this.gapFromTop) / (this.alienHeight + this.gapBetweenAliens))
    var j = Math.floor((nextX - this.gapFromWall) / (this.alienWidth + this.gapBetweenAliens))
    if (i >= this.rows || j >= this.columns ||
        i < 0 || j < 0 || !this.aliens[i][j]) {
        // Does not hit anything
        return;
    }
    // In what way does it hit the alien (bottom/top or left/right)
    var alienTopY = this.gapFromTop + (i * (this.gapBetweenAliens + this.alienHeight));
    var alienBottomY = alienTopY + this.alienHeight;

    var alienLeftX = this.gapFromWall + (j * (this.gapBetweenAliens + this.alienWidth))
    var alienRightX = alienLeftX + this.alienWidth;

    if (nextY < alienBottomY && prevY > alienBottomY ||
        nextY > alienTopY && prevY < alienTopY) {
        if (nextX > alienLeftX && prevX < alienLeftX ||
            nextX < alienRightX && prevX > alienRightX) {
            ball.xVel *= -1;
            this.alienHit(i, j);
            return
        } else {
            ball.yVel *= -1;
            this.alienHit(i, j);
            return
        }
    }
    if (nextX > alienLeftX && prevX < alienLeftX ||
        nextX < alienRightX && prevX > alienRightX) {
        ball.xVel *= -1;
        this.alienHit(i, j);
    }

}

Aliens.alienHit = function (i, j) {
    this.aliens[i][j]--;
    if (!this.aliens[i][j]) {
        makeBrickFall(i, j);    // In fallingBrick.js
    }
}
