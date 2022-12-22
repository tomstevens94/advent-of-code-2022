var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt"); // Part 2 answer is 301 for small input
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
});

monkeys.humn.isCalculated = false;
monkeys.humn.value = NaN;
monkeys.root.equation.operation = '='; // Adjust data to match Part 2

const humanValue = findHumanValue();
console.log('HUMAN VALUE', humanValue); // Part 2 - 3560324848168

function findHumanValue() { // Recursively find monkeys value and calculate final value
  const root = monkeys['root'];

  const monkeyNameA = root.equation.monkeyA;
  const monkeyNameB = root.equation.monkeyB;

  const monkeyA = monkeys[monkeyNameA];
  const monkeyB = monkeys[monkeyNameB];

  const valueA = findMonkeyValue(monkeyNameA); // One of these will be undefined
  const valueB = findMonkeyValue(monkeyNameB);


  let monkeyWithNoValue = valueA === undefined ? monkeyA : monkeyB;
  monkeyWithNoValue.value = Number.isInteger(valueA) ? valueA : valueB;

  const lowerMonkeyA = monkeyWithNoValue.equation.monkeyA;
  const lowerMonkeyB = monkeyWithNoValue.equation.monkeyB;

  return backtrackToFindValue(lowerMonkeyA, lowerMonkeyB, monkeyWithNoValue)
}

function backtrackToFindValue(monkeyNameA, monkeyNameB, monkeyParent) { // Given a money name, find what 'humn' has to yell to match given value
  const monkeyA = monkeys[monkeyNameA];
  const monkeyB = monkeys[monkeyNameB];

  const valueA = findMonkeyValue(monkeyNameA);
  const valueB = findMonkeyValue(monkeyNameB);


  const monkeyWithNoValue = valueA === undefined ? monkeyA : monkeyB;
  const monkeyWithNoValueName = valueA === undefined ? monkeyNameA : monkeyNameB;

  const valueToCreate = monkeyParent.value;

  switch (monkeyParent.equation.operation) { // Assign value to monkey that is missing one
    case '/': {
      if (valueA === undefined) {
        monkeyA.value = valueToCreate * valueB;
      } else if (valueB == undefined) {
        monkeyB.value = valueA / valueToCreate;
      }
      break;
    }
    case '*': {
      if (valueA === undefined) {
        monkeyA.value = valueToCreate / valueB;
      } else if (valueB == undefined) {
        monkeyB.value = valueToCreate / valueA;
      }
      break;
    }
    case '-': {
      if (valueA === undefined) {
        monkeyA.value = valueToCreate + valueB;
      } else if (valueB == undefined) {
        monkeyB.value = valueA - valueToCreate;
      }
      break;
    }
    case '+': {
      if (valueA === undefined) {
        monkeyA.value = valueToCreate - valueB;
      } else if (valueB == undefined) {
        monkeyB.value = valueToCreate - valueA;
      }
      break;
    }
  }

  if (monkeyWithNoValueName === 'humn') return monkeyWithNoValue.value;

  const lowerMonkeyA = monkeyWithNoValue.equation.monkeyA;
  const lowerMonkeyB = monkeyWithNoValue.equation.monkeyB;

  return backtrackToFindValue(lowerMonkeyA, lowerMonkeyB, monkeyWithNoValue);
}

function findMonkeyValue(monkeyName) { // Recursively find monkeys value based on nested monkeys values
  const monkey = monkeys[monkeyName];

  if (monkeyName === 'humn') return undefined;

  if (monkey.isCalculated) {
    return monkey.value;
  } else {
    const equation = monkey.equation
    const valueA = findMonkeyValue(equation.monkeyA);
    const valueB = findMonkeyValue(equation.monkeyB);

    if (valueA === undefined || valueB === undefined) return undefined;

    switch (equation.operation) {
      case '*': return valueA * valueB;
      case '/': return valueA / valueB;
      case '+': return valueA + valueB;
      case '-': return valueA - valueB;
      default: return undefined;
    }
  }
}

