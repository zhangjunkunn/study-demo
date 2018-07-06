class Square {
  constructor(data, rotate, dir) {
    this.data = data
    this.origin = {
      x: 0,
      y: 3
    }
    this.rotate = rotate
    this.dir = dir || 0
  }
}
export default Square