var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const rows = input.split('\n').map(e => e.split('').map(str => Number(str)));
let viewableCount = 0;

rows.forEach((row, y) => {
  row.forEach((height, x) => {
    if (
      x === 0 ||
      x === row.length - 1 ||
      y === 0 ||
      y === rows.length - 1) { // Tree is on the edge
      viewableCount += 1;
      return;
    }

    const visibleFromLeft = row.slice(0, x).every(e => e < height);
    const visibleFromRight = row.slice(x + 1, row.length).every(e => e < height);
    const visibleFromAbove = rows.filter((_, ri) => ri < y).map(r => r.filter((h, ci) => ci === x)).every(e => e < height);
    const visibleFromBelow = rows.filter((_, ri) => ri > y).map(r => r.filter((h, ci) => ci === x)).every(e => e < height);

    if (
      visibleFromLeft ||
      visibleFromRight ||
      visibleFromAbove ||
      visibleFromBelow
    ) viewableCount += 1;
  })
});

console.log(viewableCount); // Part 1