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

let rope = new Array(10).fill(new Vec2(0, 0));

let usedPositions = [];
addPosition();

function addPosition() {
  const tail = rope[rope.length - 1];
  usedPositions.push(`${tail.x}.${tail.y}`);
}

lines.forEach((line, lineIndex) => {
  const [dir, dist] = line.split(' ');


  for (let i = 0; i < dist; i++) {
    switch (dir) {
      case 'U': {
        rope[0] = rope[0].moveY(-1);
        moveSegments();
        continue;
      }
      case 'D': {
        rope[0] = rope[0].moveY(1);
        moveSegments();
        continue;
      }
      case 'L': {
        rope[0] = rope[0].moveX(-1);
        moveSegments();
        continue;
      }
      case 'R': {
        rope[0] = rope[0].moveX(1);
        moveSegments();
        continue;
      }
    }

  }
  if (lineIndex < 50) console.log(dir, dist, rope);
})

function moveSegments() {
  for (let i = 1; i < rope.length; i++) {
    const seg = rope[i];
    const leadingSeg = rope[i - 1];

    moveSegment(i);
  }
}

function moveSegment(i) {
  if (rope[i - 1].isTouching(rope[i])) return;

  if (rope[i - 1].distX(rope[i]) > 0 && rope[i - 1].distY(rope[i]) > 0) { // Move diagonally
    const xDir = Math.sign(rope[i - 1].x - rope[i].x);
    const yDir = Math.sign(rope[i - 1].y - rope[i].y);

    // const xDist = head.distX(tail);
    // const yDist = head.distX(tail);

    rope[i] = rope[i].move(xDir, yDir);

  } else if (rope[i - 1].x === rope[i].x) { // Move vertically
    const yDist = rope[i - 1].y - rope[i].y;

    // const xDist = head.distX(tail);
    // const yDist = head.distX(tail);

    rope[i] = rope[i].moveY(yDist > 0 ? yDist - 1 : yDist + 1);
  } else if (rope[i - 1].y === rope[i].y) { // Move horizontailly
    const xDist = rope[i - 1].x - rope[i].x;

    // const xDist = head.distX(tail);
    // const yDist = head.distX(tail);

    rope[i] = rope[i].moveX(xDist > 0 ? xDist - 1 : xDist + 1);
  }

  addPosition();
}

let cache = {};
usedPositions.forEach(pos => {
  cache[pos] = cache[pos] + 1 || 1;
})

// console.log(cache);
console.log(Object.keys(cache).length);