var KEY_SPACE = keyCode(' '); 

g_menuScene = {};

g_menuScene.init = function() {

};

g_menuScene.updateSimulation = function (du) {
  if (eatKey(KEY_SPACE)) {
    g_sceneManager.loadScene("game");
  }
};

g_menuScene.renderSimulation = function (ctx) {
  ctx.save();

  ctx.font = '48px monospace';
  let title = "Galaxian";
  let textMeasure = ctx.measureText(title);
  let x = (g_canvas.width - textMeasure.width) / 2;
  ctx.fillText(title, x, 150);

  ctx.font = "16px monospace";
  let subtitle = "press SPACE to play";
  textMeasure = ctx.measureText(subtitle);
  x = (g_canvas.width - textMeasure.width) / 2;
  ctx.fillText(subtitle, x, 200);
  
  ctx.restore();
};