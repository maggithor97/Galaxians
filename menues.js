

//score advance table
function RenderScoreAT(ctx){
    let titleText = "- SCORE ADVANCE TABLE -";

    var alienYPos = 260;
    for(let i=3; i>0; i--){
        console.log(alienYPos);
        g_sprites.aliens[i][0].drawCentredAt(ctx, 40, alienYPos, 0);
        alienYPos += g_sprites.aliens[i][0].scale;
    }
}