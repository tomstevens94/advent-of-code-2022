var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const lines = input.split('\n');

const monkeys = [];

for (let i = 0; i < lines.length; i += 7) {
  let monkey = lines.slice(i, i + 6);
  let obj = {
    heldItems: [],
    operation: {
      type: '',
      value: 0
    },
    divisibleTest: 0,
    trueThrow: 0,
    falseThrow: 0
  };

    monkey = monkey.forEach((e, i) => {
        switch (i) {
            case 1: obj.heldItems = e.replace('Starting items: ', '').split(', ').map(e => Number(e)); return;
            case 2: {
                obj.operation.type = e.split(' ')[6];
                const value = Number(e.split(' ')[7].trim());
                obj.operation.value = value ? Number(value) : 'oldValue'; 
                return;
            }
            case 3: obj.divisibleTest = Number(e.replace('Test: divisible by ', ''));
            case 4: obj.trueThrow = Number(e.replace('If true: throw to monkey ', ''));
            case 5: obj.falseThrow = Number(e.replace('If false: throw to monkey ', ''));
        }
    })
    monkeys.push(obj);
}
const commonFactor = monkeys.map(e => e.divisibleTest).reduce((total, num) => total * num, 1);

let inspections = {};

monkeys.forEach((_, i) => inspections[i] = 0);
console.log(monkeys)
const loopCount = 10000;
for (let i = 0; i < loopCount; i++) {
  monkeys.forEach((monkey, i) => {
    if (!monkey.heldItems.length) return;

    const { type, value } = monkey.operation;

    monkey.heldItems.forEach((worry) => {
      inspections[i] += 1;

      const adjValue = value === 'oldValue' ? worry : value;

      let newWorry = type === '*' ? worry * adjValue : worry + adjValue;

      const testIsTrue = newWorry % monkey.divisibleTest === 0;
      if (testIsTrue) {
          monkeys[monkey.trueThrow].heldItems.push(newWorry % commonFactor);
      } else {
          monkeys[monkey.falseThrow].heldItems.push(newWorry % commonFactor);
      }
    
      monkey.heldItems = [];
    });

    monkey.heldItems = [];
  });
}

const sortedInspections = Object.values(inspections).sort((a, b) => b - a);
const firstTwo = sortedInspections.slice(0, 2);
console.log('MONEY BUSINESS: ', firstTwo.reduce((total, num) => total * num, 1)); // Part 2

// Tried:
// 32045296119