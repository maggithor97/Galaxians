function ScoreManager(descr) {
  for (var property in descr) {
      this[property] = descr[property];
  }

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
