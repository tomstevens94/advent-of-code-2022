var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const rows = input.split('\n').map(e => e.split('').map(str => Number(str)));
let scenicScores = [];

rows.forEach((row, y) => {
  row.forEach((height, x) => {
    const cellsAbove = rows.filter((_, ri) => ri < y).map(r => r.filter((_, ci) => ci === x)).reverse()
    const scoreAbove = (cellsAbove.findIndex(e => e >= height) + 1) || cellsAbove.length;

    const cellsBelow = rows.filter((_, ri) => ri > y).map(r => r.filter((_, ci) => ci === x))
    const scoreBelow = (cellsBelow.findIndex(e => e >= height) + 1) || cellsBelow.length;

    const cellsLeft = row.filter((_, ri) => ri < x).reverse()
    const scoreLeft = (cellsLeft.findIndex(e => e >= height) + 1) || cellsLeft.length;

    const cellsRight = row.filter((_, ri) => ri > x)
    const scoreRight = (cellsRight.findIndex(e => e >= height) + 1) || cellsRight.length;

    scenicScores.push(scoreAbove * scoreBelow * scoreLeft * scoreRight);
  });
})

console.log(Math.max(...scenicScores));