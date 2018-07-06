import Game from './game.js'
class Local {
  constructor() {
    this.doms = {
      gameDiv: document.getElementById('game'),
      nextDiv: document.getElementById('next')
    }
    this.game = null;
  }
  bindKeyEvent() {
    document.onkeydown = e => {
      switch (e.keyCode) {
        case 39:
          this.game.right();
          break;
        case 40:
          this.game.down();
          break;
        case 37:
          this.game.left();
          break;
        case 32:
          this.game.drop();
          break;
        case 38:
          this.game.rotate();
          break;
      }
    }
  }
  start() {
    this.bindKeyEvent();
    this.game = new Game();
    this.game.init(this.doms);
  }
}
export default Local