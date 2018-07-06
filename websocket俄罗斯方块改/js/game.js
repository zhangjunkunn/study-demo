import GameController from './gameController.js'
import SquareFactory from './squareFactory.js'
class Game {
  constructor() {
    this.gameData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.nextDivs = [];
    this.gameDivs = [];
    this.cur = null;
    this.next = null;
    this.gameController = null;
    this.squareFactory = null;
    this.timer = null;
  }
  // 初始化div
  initDiv(divs, data, container) {
    let docFragment = document.createDocumentFragment();
    for (let i = 0; i < data.length; i++) {
      let div = [];
      for (let j = 0; j < data[i].length; j++) {
        let newNode = document.createElement('div');
        newNode.className = 'none';
        newNode.style.top = `${i*20}px`;
        newNode.style.left = `${j*20}px`;
        docFragment.appendChild(newNode);
        div.push(newNode);
      }
      divs.push(div);
    }
    container.appendChild(docFragment);
  }
  // 刷新div
  refreshDiv(divs, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        let gameData = data[i][j];
        if (gameData == 0) {
          divs[i][j].className = 'none';
        } else if (gameData == 1) {
          divs[i][j].className = 'done';
        } else if (gameData == 2) {
          divs[i][j].className = 'current';
        }
      }
    }
  }
  // 下移
  down() {
    if(this.gameController.canDown(this.cur, this.gameData)) {
      this.gameController.down(this.cur, this.gameData);
      this.refreshDiv(this.gameDivs, this.gameData);
      return true;
    } else {
      return false;
    }
  }
  left() {
    if (this.gameController.canLeft(this.cur, this.gameData)) {
      this.gameController.left(this.cur, this.gameData);
      this.refreshDiv(this.gameDivs, this.gameData);
      return true;
    } else {
      return false;
    }
  }
  right() {
    if (this.gameController.canRight(this.cur, this.gameData)) {
      this.gameController.right(this.cur, this.gameData);
      this.refreshDiv(this.gameDivs, this.gameData);
      return true;
    } else {
      return false;
    }
  }
  drop() {
    while (this.down()) {}
  }
  rotate(flag) {
    flag = flag ? true : false
    if(this.gameController.canRotate(this.cur, this.gameData)) {
      this.gameController.rotate(this.cur, this.gameData, flag);
      this.refreshDiv(this.gameDivs, this.gameData);
    }
  }
  fixed() {
    this.gameController.fixed(this.cur, this.gameData);
    this.refreshDiv(this.gameDivs, this.gameData);
  }
  autoRun() {
    if(!this.down()) {
      this.fixed();
      this.checkClear();
      console.log(this.checkGameOver())
      if(this.checkGameOver()) {
        this.stop();
      } else {
        this.performNext();
      }
    }
  }
  checkClear() {
    for(let i = this.gameData.length - 1; i >= 0; i --) {
      let clean = true;
      for(let j = this.gameData[i].length - 1; j >= 0; j --) {
        if(this.gameData[i][j] != 1) clean = false;
      }
      if(clean) {
        for(let t = i; t > 0; t --) {
          for(let j = 0; j < this.gameData[t].length; j ++) {
            this.gameData[t][j] = this.gameData[t - 1][j];
          }
        }
        for(let j = 0; j < this.gameData[i].length; j ++) {
          this.gameData[0][j] = 0;
        }
        i++;
      }
    }
  }
  checkGameOver() {
    for(let j = 0; j < this.gameData[0].length; j ++) {
      if(this.gameData[0][j] == 1) {
        return true;
      }
    }
    return false;
  }
  stop() {
    clearInterval(this.timer);
    this.timer = null;
    console.log('game over')
  }
  performNext() {
    this.cur = this.next || this.squareFactory.makeSquare();
    this.next = this.squareFactory.makeSquare();

    this.gameController.initRotate(this.cur, this.next, this.gameData);
    this.gameController.setData(this.cur, this.gameData);

    // this.refreshDiv(this.gameDivs, this.gameData);
    // this.refreshDiv(this.nextDivs, this.next.data);
  }
  // 游戏初始化
  init(doms) {
    this.squareFactory = new SquareFactory();
    this.gameController = new GameController();

    this.performNext()

    this.initDiv(this.gameDivs, this.gameData, doms.gameDiv);
    this.initDiv(this.nextDivs, this.next.data, doms.nextDiv);

    this.refreshDiv(this.gameDivs, this.gameData);
    this.refreshDiv(this.nextDivs, this.next.data);

    this.timer = setInterval(() => {
      this.autoRun();
    }, 200)
  }
}
export default Game