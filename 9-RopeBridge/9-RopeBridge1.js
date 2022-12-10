var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const lines = input.split('\n')

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;;
  }
  moveX(num) {
    return new Vec2(this.x + num, this.y);
  }
  moveY(num) {
    return new Vec2(this.x, this.y + num);
  }
  move(x, y) {
    return new Vec2(this.x + x, this.y + y);
  }
  isTouching(vec) {
    return this.distX(vec) <= 1 && this.distY(vec) <= 1;
  }
  distX(vec) {
    return Math.max(this.x, vec.x) - Math.min(this.x, vec.x);
  }
  distY(vec) {
    return Math.max(this.y, vec.y) - Math.min(this.y, vec.y);
  }
}

let tail = new Vec2(0, 0);
let head = new Vec2(0, 0);
let usedPositions = [`${tail.x}.${tail.y}`];

lines.forEach((line, lineIndex) => {
  const [dir, dist] = line.split(' ');


  for (let i = 0; i < dist; i++) {
    switch (dir) {
      case 'U': {
        head = head.moveY(-1);
        moveTail();
        continue;
      }
      case 'D': {
        head = head.moveY(1);
        moveTail();
        continue;
      }
      case 'L': {
        head = head.moveX(-1);
        moveTail();
        continue;
      }
      case 'R': {
        head = head.moveX(1);
        moveTail();
        continue;
      }
    }

  }
  // console.log(dir, dist, head, tail);
})

function moveTail() {
  if (head.isTouching(tail)) return;

  if (head.distX(tail) > 0 && head.distY(tail) > 0) { // Move diagonally
    const xDir = Math.sign(head.x - tail.x);
    const yDir = Math.sign(head.y - tail.y);

    // const xDist = head.distX(tail);
    // const yDist = head.distX(tail);

    tail = tail.move(xDir, yDir);

  } else if (head.x === tail.x) { // Move vertically
    const yDist = head.y - tail.y;

    // const xDist = head.distX(tail);
    // const yDist = head.distX(tail);

    tail = tail.moveY(yDist > 0 ? yDist - 1 : yDist + 1);
  } else if (head.y === tail.y) { // Move horizontailly
    const xDist = head.x - tail.x;

    // const xDist = head.distX(tail);
    // const yDist = head.distX(tail);

    tail = tail.moveX(xDist > 0 ? xDist - 1 : xDist + 1);
  }

  usedPositions.push(`${tail.x}.${tail.y}`);
}

let cache = {};
usedPositions.forEach(pos => {
  cache[pos] = cache[pos] + 1 || 1;
})

console.log(Object.keys(cache).length);