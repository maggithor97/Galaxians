function ScoreManager(descr) {
  for (var property in descr) {
      this[property] = descr[property];
  }

  this.bossScoreRange = [150, 200, 300, 800];

  this.scoreTable = {
    "charger": [],
    "convoy": []
  };

  this.playerScore = 0;
  this.highScore = localStorage.getItem("highscore") || 0;
}

ScoreManager.prototype.addToScoreTable = function (mode, value) {
  this.scoreTable[mode].push(value);
}

ScoreManager.prototype.getFromScoreTable = function (mode, type) {
  return this.scoreTable[mode][type];
}

ScoreManager.prototype.setRandomBossScore = function () {
  let index = util.randRange(0, 4);
  this.scoreTable.charger[3] = this.bossScoreRange[index];
}

ScoreManager.prototype.increasePlayerScore = function (mode, type) {
  this.playerScore += this.scoreTable[mode][type];

  if (this.playerScore > this.highScore) {
    this.highScore = this.playerScore;
    localStorage.setItem("highscore", this.playerScore);
  }
}

ScoreManager.prototype.getPlayerScore = function () {
  return this.playerScore;
}

ScoreManager.prototype.getHighScore = function () {
  return this.highScore;
}

ScoreManager.prototype.reset = function () {
  this.playerScore = 0;
  this.highScore = localStorage.getItem("highscore") || 0;
}
