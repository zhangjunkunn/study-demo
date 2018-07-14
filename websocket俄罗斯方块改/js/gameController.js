// 检查单个方块是否出界或者碰撞
let checkSquare = (pos, x, y, gameData) => {
  if (pos.x + x < 0) {
    return false;
  } else if (pos.x + x >= gameData.length) {
    return false;
  } else if (pos.y + y < 0) {
    return false;
  } else if (pos.y + y >= gameData[0].length) {
    return false;
  } else if (gameData[pos.x + x][pos.y + y] == 1) {
    return false;
  }
  return true;
}

// 检查是否可移动
let isValid = (newPos, curData, gameData) => {
  for (let i = 0; i < curData.length; i++) {
    for (let j = 0; j < curData[i].length; j++) {
      if (curData[i][j] == 2) {
        if (!checkSquare(newPos, i, j, gameData)) {
          return false;
        }
      }
    }
  }
  return true;
}

// 清除数据
let clearData = (cur, gameData) => {
  for (let i = 0; i < cur.data.length; i++) {
    for (let j = 0; j < cur.data[i].length; j++) {
      if (cur.data[i][j] == 2 && checkSquare(cur.origin, i, j, gameData)) {
        gameData[cur.origin.x + i][cur.origin.y + j] = 0;
      }
    }
  }
}

// 设置数据
// let setData = (cur, gameData) => {
//   for (let i = 0; i < cur.data.length; i++) {
//     for (let j = 0; j < cur.data[i].length; j++) {
//       if (cur.data[i][j] == 2 && checkSquare(cur.origin, i, j)) {
//         gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
//       }
//     }
//   }
// }


class GameController {
  constructor() {

  }

  down(cur, gameData) {
    clearData(cur, gameData);
    cur.origin.x += 1;
    this.setData(cur, gameData);
  }

  right(cur, gameData) {
    clearData(cur, gameData);
    cur.origin.y += 1;
    this.setData(cur, gameData);
  }
  left(cur, gameData) {
    clearData(cur, gameData);
    cur.origin.y -= 1;
    this.setData(cur, gameData);
  }
  
  canDown(cur, gameData) {
    let temp = {
      x: cur.origin.x + 1,
      y: cur.origin.y
    }
    return isValid(temp, cur.data, gameData)
  }
  canRight(cur, gameData) {
    let temp = {
      x: cur.origin.x,
      y: cur.origin.y + 1
    }
    return isValid(temp, cur.data, gameData)
  }
  canLeft(cur, gameData) {
    let temp = {
      x: cur.origin.x,
      y: cur.origin.y - 1
    }
    return isValid(temp, cur.data, gameData)
  }
  canRotate(cur, gameData) {
    let d = (cur.dir + 1) % 4;
    let temp = [
      [], [], [], []
    ]
    for(let i = 0; i < cur.data.length; i ++) {
      for(let j = 0; j < cur.data[i].length; j ++) {
        temp[i][j] = cur.rotate[d][i][j];
      }
    }
    return isValid(cur.origin, temp, gameData)
  }
  rotate(cur, gameData, flag) {
    clearData(cur, gameData);
    let rotateDir = flag ? 0 : 1;
    cur.dir = (cur.dir + rotateDir) % 4;
    for (let i = 0; i < cur.data.length; i++) {
      for (let j = 0; j < cur.data[i].length; j++) {
        cur.data[i][j] = cur.rotate[cur.dir][i][j];
      }
    }
    this.setData(cur, gameData);
  }
  initRotate(cur, next, gameData) {
    this.rotate(cur, gameData, true);
    for (let i = 0; i < next.data.length; i++) {
      for (let j = 0; j < next.data[i].length; j++) {
        next.data[i][j] = next.rotate[next.dir][i][j];
      }
    }
  }
  fixed(cur, gameData) {
    for (let i = 0; i < cur.data.length; i++) {
      for (let j = 0; j < cur.data[i].length; j++) {
        if (checkSquare(cur.origin, i, j, gameData)) {
          if(gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
            gameData[cur.origin.x + i][cur.origin.y + j] = 1;
          }
        }
      }
    }
  }
  clearData(cur, gameData) {
    clearData(cur, gameData)
  }
  setData(cur, gameData) {
    for (let i = 0; i < cur.data.length; i++) {
      for (let j = 0; j < cur.data[i].length; j++) {
        if (cur.data[i][j] == 2 && checkSquare(cur.origin, i, j, gameData)) {
          gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
        }
      }
    }
  }
}
export default GameController