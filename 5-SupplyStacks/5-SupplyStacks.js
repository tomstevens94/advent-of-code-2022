var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const lines = input.split('\r\n');

const stacksString = lines.slice(0, 8);
const amountOfStacks = (stacksString[0].length + 1) / 4;

let cols = stacksString.reverse().map(row => {
  return row.split('').filter((e, i) => (e !== '[') && (e !== ']') && (i - 1) % 4 === 0);
});

cols = [...cols, new Array(cols[0].length).fill(' ')];

for (let y = 0; y < cols.length; y++) {
  for (let x = y; x < cols[0].length; x++) {
    [cols[y][x], cols[x][y]] = [cols[x][y], cols[y][x]];
  }
}

cols = cols.map(col => col.filter(e => e !== ' '));

const steps = lines.slice(10);

steps.forEach((step, i) => {
  const [amt, from, to] = step.split(' ').filter(e => Number.isInteger(Number(e)));

  if (i < 2) {
    console.log(`Moving ${amt} boxes from ${from} to ${to}`);
  }

  const movingBoxes = cols[from - 1].splice(0 - amt);

  cols[to - 1].push(...movingBoxes);

  if (i < 2) {
    console.log(cols[to - 1]);
  }
});

console.log(cols.map(e => e[e.length - 1]).join('')); // Part 1