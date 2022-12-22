var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const rows = input.split('\n')

let monkeys = {};

rows.forEach(e => { // Create monkeys object
  const split = e.split(' ');
  const monkeyName = split[0].replace(':', '');

  const value = Number(split[1]);
  const isCalculated = Number.isInteger(value);
  const equation = isCalculated ? null : {
    monkeyA: split[1],
    monkeyB: split[3],
    operation: split[2]
  }

  monkeys[monkeyName] = {
    isCalculated,
    value,
    equation
  }
})

function findMonkeyValue(monkeyName) { // Recursively find monkeys value and calculate final value
  const monkey = monkeys[monkeyName];

  if (monkey.isCalculated) {
    return monkey.value;
  } else {
    const equation = monkey.equation
    const valueA = findMonkeyValue(equation.monkeyA);
    const valueB = findMonkeyValue(equation.monkeyB);

    switch (equation.operation) {
      case '*': return valueA * valueB;
      case '/': return valueA / valueB;
      case '+': return valueA + valueB;
      case '-': return valueA - valueB;
      default: return undefined;
    }
  }
}

const root = findMonkeyValue('root');

console.log(root); // Part 1