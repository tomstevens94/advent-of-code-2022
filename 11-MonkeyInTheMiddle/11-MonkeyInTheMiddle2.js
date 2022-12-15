var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

// console.log(input);

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
            case 1: obj.heldItems = e.replace('Starting items: ', '').split(', ').map(e => BigInt(e)); return;
            case 2: {
                obj.operation.type = e.split(' ')[6];
                const value = Number(e.split(' ')[7].trim());
                obj.operation.value = value ? BigInt(value) : 'oldValue'; 
                return;
            }
            case 3: obj.divisibleTest = BigInt(e.replace('Test: divisible by ', ''));
            case 4: obj.trueThrow = Number(e.replace('If true: throw to monkey ', ''));
            case 5: obj.falseThrow = Number(e.replace('If false: throw to monkey ', ''));
        }
    })
    monkeys.push(obj);
}

let inspections = {};

monkeys.forEach((_, i) => inspections[i] = 0);

for (let i = 0; i < 100; i++) {
    monkeys.forEach((monkey, i) => {
        if (!monkey.heldItems.length) return;

    const { type: operType, value } = monkey.operation;
    monkey.heldItems.forEach((worry) => {
      inspections[i] += 1;

            const adjValue = value === 'oldValue' ? worry : value;
            
            let newWorry = operType === '*' ? worry * adjValue : worry + adjValue;

            const testIsTrue = newWorry % adjValue == 0;
            if (testIsTrue) {
                monkeys[monkey.trueThrow].heldItems.push(newWorry);
            } else {
                monkeys[monkey.falseThrow].heldItems.push(newWorry);
            }
        });

        monkey.heldItems = [];
    });

    monkey.heldItems = [];
  });
}

console.log(monkeys)
// console.log(inspections);
console.log(Object.values(inspections).sort((a, b) => b - a).slice(0, 2).reduce((total, num) => total * num, 1)); // Part 1

// < 14391121333
// not 14398800024