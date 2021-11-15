function SceneManager(descr) {
  for (var property in descr) {
      this[property] = descr[property];
  }
}

SceneManager.prototype.scenes = {};
SceneManager.prototype.activeScene = "menu";

SceneManager.prototype.addScene = function (id, scene) {
  //this.scenes.push(scene);
  this.scenes[id] = scene;
}

SceneManager.prototype.getActiveScene = function () {
  return this.scenes[this.activeScene];
}

SceneManager.prototype.loadScene = function (id, argsForInit = false) {
  this.activeScene = id;
  this.scenes[this.activeScene].init(argsForInit);
}

SceneManager.prototype.restart = function () {
  //this.activeScene = "menu";
  this.loadScene("menu");
}
