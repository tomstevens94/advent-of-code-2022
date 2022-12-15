var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

let pairs = input.split('\n\n').map(pair => pair.split('\n'));

pairs = pairs.map((pair) => {
  return pair.map(e => JSON.parse(e));
})

let correctPairs = [];

pairs.forEach((pair, pairIndex) => {
  for (let i = 0; i < pair[0].length; i++) {
    const left = pair[0];
    const right = pair[1];

    let leftItem = left[i];
    let rightItem = right[i];

    if (Number.isInteger(leftItem) && Number.isInteger(rightItem)) { // Both items are integers
      if (leftItem < rightItem) { // Correct
        correctPairs.push(pairIndex);
        break;
      } else if (leftItem > rightItem) { // Incorrect
        break;
      } else { // Items are equal, continue;
        continue;
      }
    }

    if (Array.isArray(leftItem) && Array.isArray(rightItem)) {
      if (rightItem.length === 0) { // Correct
        break;
      }
      if (leftItem.length === 0) { // Incorrect
        correctPairs.push(pairIndex);
        break;
      }
    }

    if ([leftItem, rightItem].filter(e => Number.isInteger(e)).length === 1) { // Only one item is integer

    }
  }
})

console.log(correctPairs.length);