

var g_fallingBricks = {
    bricks: []
};


function makeBrickFall(i, j) {
    var deadBrick = {
        i: i,
        j: j,
        alpha: 1,
        frame: 1
    };
    g_fallingBricks.bricks.push(deadBrick);
}

g_fallingBricks.render = function (ctx) {
    this.drawFallingBricks(ctx)
}

g_fallingBricks.drawFallingBricks = function (ctx) {
    var length = this.bricks.length;
    for(var k = length;k>0;k--) {
        var index = k-1;
        var brick = this.bricks[index];
        if(brick.frame > 20) {
            this.bricks.splice(index)
            break;
        }
        var i = brick.i;
        var j = brick.j;
        var y = g_bricks.gapFromTop + (i * (g_bricks.gapBetweenBricks + g_bricks.brickHeight));
        var x = g_bricks.gapFromWall + (j * (g_bricks.gapBetweenBricks + g_bricks.brickWidth));
        brick.alpha -= 0.05;
        var style = `rgba(12,236,221,${brick.alpha})`
        fillBox(ctx, x, y + brick.frame, g_bricks.brickWidth, g_bricks.brickHeight, style)
        brick.frame += 1;
    }
    
}