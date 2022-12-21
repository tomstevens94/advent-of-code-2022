var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const cubes = input.split('\n').map(e => e.split(',').map(e => Number(e)));

let top = 0;
let bottom = 0;
let left = 0;
let right = 0;
let front = 0;
let back = 0;

cubes.forEach(([x, y, z], i, a) => {
  // Loop through every cube - check if a cube exists above current position. If not cube exists, add one to top. Repeat for all 6 sides on all cubes
  if (a.findIndex(e => e.every((e1, i) => e1 === [x, y - 1, z][i])) === -1) { // Top
    top++;
  }
  if (a.findIndex(e => e.every((e1, i) => e1 === [x, y + 1, z][i])) === -1) { // Bottom
    bottom++;
  }
  if (a.findIndex(e => e.every((e1, i) => e1 === [x - 1, y, z][i])) === -1) { // Left
    left++;
  }
  if (a.findIndex(e => e.every((e1, i) => e1 === [x + 1, y, z][i])) === -1) { // Right
    right++;
  }
  if (a.findIndex(e => e.every((e1, i) => e1 === [x, y, z - 1][i])) === -1) { // Front
    front++;
  }
  if (a.findIndex(e => e.every((e1, i) => e1 === [x, y, z + 1][i])) === -1) { // Back
    back++;
  }
})

const surfaceArea = [
  top,
  bottom,
  left,
  right,
  front,
  back
].reduce((total, num) => total + num, 0);

console.log(surfaceArea); // Part 1