// =====
// UTILS
// =====
var gameOverImg = document.getElementById("gameOver");

var g_images = {
    paddlePicture: 0,
    gameOverPicture: gameOverImg
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function fillBox(ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

function gameOver(ctx) {
    var dx = g_canvas.width/4;
    var dy = g_canvas.height/2;
    var height = g_canvas.height/4;
    var width = g_canvas.width/2;
    //ctx.drawImage(gameOverImg, dx, dy, width, height)
    var oldFont = ctx.font;
    var oldStyle = ctx.fillStyle;
    ctx.font = 'bold 100px serif';
    ctx.fillStyle = "#C400FF";
    ctx.fillText("Game Over", dx,dy,width)
    ctx.fillStyle = oldStyle;
    ctx.font = oldFont
}