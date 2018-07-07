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
    this.timeDiv = null;
    this.scoreDiv = null;
    this.timeCount = 0;
    this.score = 0;
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
  // 固定方块
  fixed() {
    this.gameController.fixed(this.cur, this.gameData);
    this.refreshDiv(this.gameDivs, this.gameData);
  }

  autoRun() {
    let scoreCount;
    if(!this.down()) {
      this.fixed();
      scoreCount = this.checkClear();
      if(scoreCount != 0) {
        this.setScore(scoreCount);
      }
      if(this.checkGameOver()) {
        this.stop();
      } else {
        this.performNext();
      }
    }
  }
  // 检查是否可以消行
  checkClear() {
    let clearCount = 0;
    for(let i = this.gameData.length - 1; i >= 0; i --) {
      let clean = true;
      for(let j = this.gameData[i].length - 1; j >= 0; j --) {
        if(this.gameData[i][j] != 1) clean = false;
      }
      if(clean) {
        clearCount ++;
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
    return clearCount;
  }
  // 检查游戏是否结束
  checkGameOver() {
    for(let j = 0; j < this.gameData[0].length; j ++) {
      if(this.gameData[0][j] == 1) {
        return true;
      }
    }
    return false;
  }
  // 游戏结束停止运行
  stop() {
    clearInterval(this.timer);
    this.timer = null;
    console.log('game over')
  }
  run() {
    let timeCount = 0;
    this.timer = setInterval(() => {
      this.autoRun();
      timeCount ++;
      if(timeCount == 5) {
        timeCount = 0;
        this.timeCount ++;
        this.setTime();
      }
    }, 200)
  }
  setTime() {
    this.timeDiv.innerHTML = this.timeCount
  }
  setScore(score) {
    this.score += score;
    this.scoreDiv.innerHTML = this.score
  }
  // 刷新当前方块和下一个方块
  performNext() {
    // this.gameController.clearData(this.cur, this.gameData)
    this.cur = this.next || this.squareFactory.makeSquare();
    this.next = this.squareFactory.makeSquare();

    this.gameController.initRotate(this.cur, this.next, this.gameData);
    this.gameController.setData(this.cur, this.gameData);

    this.refreshDiv(this.gameDivs, this.gameData);
    this.refreshDiv(this.nextDivs, this.next.data);
  }
  // 游戏初始化
  init(doms) {

    this.timeDiv = doms.timeDiv;
    this.scoreDiv = doms.scoreDiv;

    this.squareFactory = new SquareFactory();
    this.gameController = new GameController();

    // this.performNext();
    // this.cur = this.squareFactory.makeSquare();
    // this.next = this.squareFactory.makeSquare();

    this.initDiv(this.gameDivs, this.gameData, doms.gameDiv);
    this.initDiv(this.nextDivs, this.squareFactory.makeSquare().data, doms.nextDiv);

    this.performNext();
    this.run();
    // this.timer = setInterval(() => {
    //   this.autoRun();
    // }, 200)
  }
}
export default Game