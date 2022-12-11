var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const lines = input.split('\n');

let cycles = [];
let currentValue = 1;

lines.forEach((line, i) => {
  if (line === 'noop') {
    cycles.push(currentValue);
  } else {
    let newValue = currentValue + Number(line.split(' ')[1]);
    cycles.push(currentValue);
    cycles.push(currentValue);
    currentValue = newValue;
  }

  if (i > 10) return;

  console.log(line, cycles, currentValue);
})

let display = new Array(cycles.length).fill('.');

display = display.map((pix, i) => {
  const cycleValue = cycles[i];

  const draw = [0, 1, 2].includes(((i + 1) % 40) - cycleValue);
  return draw ? '#' : '.'
})

let displayLines = [];

for (let i = 0; i < display.length; i += 40) {
  displayLines.push(display.slice(i, i + 39).join(''));
}

console.log(displayLines); // Part 2