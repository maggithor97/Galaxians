// ==========
// Alien STUFF
// ==========
function Aliens(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}


Aliens.prototype.render = function (ctx) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            if (this.aliens[i][j]) {
                var y = this.gapFromTop + (i * (this.gapBetweenAliens + this.alienHeight));
                var x = this.gapFromWall + (j * (this.gapBetweenAliens + this.alienWidth))
                var style = ""
                switch (this.aliens[i][j]) {
                    case 1:
                        style = "#0CECDD";
                        break;
                    case 2:
                        style = "#FF67E7";
                        break;
                    case 3:
                        style = "#C400FF"
                        break;
                }
                fillBox(ctx, x, y, this.alienWidth, this.alienHeight, style)
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



