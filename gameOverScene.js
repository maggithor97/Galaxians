
g_gameOverScene = {};

g_gameOverScene.render = function(ctx){
    ctx.save();

    ctx.fillStyle = "red";
    ctx.font = "20px monospace";
    
    let text = "GAME OVER";
    let textmeasure = ctx.measureText(text);
    let x = (g_canvas.width - textmeasure) / 2;

    ctx.fillText(text, x, 250);

    ctx.restore()
    

}