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

let signalStrengths = [];

cycles.forEach((cycle, i) => {
  const iteration = i + 1;
  const include = (iteration - 20) % 40 === 0;
  if (include) {
    signalStrengths.push(cycle * iteration);
  }
});

console.log(signalStrengths.reduce((total, num) => total + num, 0)); // Part 1