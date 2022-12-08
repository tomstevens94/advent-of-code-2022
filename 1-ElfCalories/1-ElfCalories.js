var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const words = require("./input.txt");

const caloriesPerElf = words.split('\n\r').map(e => e.split('\n').reduce((total, num) => total + Number(num), 0));

// console.log(Math.max(...caloriesPerElf)); // Part 1

const topThreeElves = caloriesPerElf.sort((a, b) => b - a).slice(0, 3);

// console.log(topThreeElves.reduce((total, num) => total + num, 0)); // Part 2

