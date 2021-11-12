
/*i'm putting this here temporarily its supposed to be a custom font
var arcadeFont = new FontFace('arcadeFont', 'url(fonts/ArcadepixPlus.ttff)');
arcadeFont.load().then(function(font){
    document.fonts.add(font);
});*/


//score advance table
function RenderScoreAT(ctx){
    let titleText = "-  SCORE  ADVANCE  TABLE  -";

    var alienStartYpos = 290;
    var spriteLinespacing = 25;
    var alienYPos = alienStartYpos + spriteLinespacing;
    var alienXPos = 100;
    
    var alienIcon = new Sprite(g_images.sheet, 2, g_sprites.aliens[3]);
    alienIcon.drawCentredAt(ctx, alienXPos, alienStartYpos, 0);

    for(let i=0; i<=2; i++){
        alienIcon = new Sprite(g_images.sheet, 2, g_sprites.aliens[i]);
        alienIcon.drawCentredAt(ctx, alienXPos, alienYPos, 0);
        alienYPos += spriteLinespacing;
    }

    ctx.font = "30px Berlin Sans FB";
    ctx.fillstyle = "white";
    ctx.fillText(titleText, g_canvas.width/2 - ctx.measureText(titleText).width/2, g_canvas.height/2);



}

