var KEY_SPACE = keyCode(' '); 

g_menuScene = {};

g_menuScene.updateSimulation = function (du) {
  if (eatKey(KEY_SPACE)) {
    g_sceneManager.loadScene("game");
  }
};

g_menuScene.renderSimulation = function (ctx) {
  ctx.save();

  var logo = new Image();
  logo.src = 'images/Galaxian_logo.png'
  let x = (g_canvas.width - logo.naturalWidth/1.6) / 2;
  ctx.drawImage(logo, x, 150, logo.naturalWidth/1.6, logo.naturalHeight/1.6);
  
  ctx.fillStyle = "cyan";
  ctx.font = "20px monospace";
  
  let subtitle = "PUSH START BUTTON";
  textMeasure = ctx.measureText(subtitle);
  x = (g_canvas.width - textMeasure.width) / 2;

  ctx.fillText(subtitle, x, 300);
  
  ctx.restore();
  
};