var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

// let pairs = input.split('\n\n').map(pair => pair.split('\n'));
let pairs = input.split('\n\r');

pairs = pairs.map(e => e.split('\n').map(e1 => e1.replace('\r', '')).filter(e2 => e2 !== ''));

pairs = pairs.map((pair) => {
  return pair.map(e => JSON.parse(e));
})

let correctPairs = [];

let testPairs = [pairs[140]];

testPairs.forEach((pair, pairIndex) => {
  const left = pair[0];
  const right = pair[1];

  let length = Math.max(left.length, right.length);
  
  console.log('COMPARING: ', pairIndex, 'line: ' + ((pairIndex * 3) + 1));

  for (let i = 0; i < length; i++) {
    if (i >= left.length) {
      correctPairs.push(pairIndex);
      console.log('LEFT RAN OUT - CORRECT')
      break;
    }
    if (i >= right.length) {
      console.log('RIGHT RAN OUT - INCORRECT')
      break;
    }

    let leftItem = left[i];
    let rightItem = right[i];

    console.log('LEFT', leftItem);
    console.log('RIGHT', rightItem);

    if (Number.isInteger(leftItem) && Number.isInteger(rightItem)) { // Both items are integers
      let integerComparison = compareIntegers(leftItem, rightItem);
      if (integerComparison === undefined) continue;
      if (integerComparison) {
        correctPairs.push(pairIndex); 
        break;
      }
      if (!integerComparison) break;
    }

    if (Array.isArray(leftItem) && Array.isArray(rightItem)) { // Both items are arrays
      console.log('BOTH ARE ARRAYS')
      if (leftItem.length === 0) { // Correct
        console.log('LEFT RAN OUT - CORRECT1');

        correctPairs.push(pairIndex);
        break;
      }
      if (rightItem.length === 0) { // Incorrect
        console.log('RIGHT RAN OUT - INCORRECT1');

        break;
      }

      let arrayComparison = compareLists(leftItem, rightItem);
      console.log('FINAL ARRAY COMPARISON', arrayComparison);
      if (arrayComparison === undefined) continue;
      if (arrayComparison) {
        correctPairs.push(pairIndex);
        break;
      }
      if (!arrayComparison) break;
    }

    if ([leftItem, rightItem].filter(e => Number.isInteger(e)).length === 1) { // Only one item is integer
      let differentComparison = compareDifferentTypes(leftItem, rightItem);
      if (differentComparison === undefined) continue;
      if (differentComparison) {
        correctPairs.push(pairIndex);
        break;
      }
      if (!differentComparison) break;
    }
  }

  console.log('----------');
})

console.log(correctPairs.map(e => e + 1).reduce((total, num) => total + num, 0)); // Part 1
// > 6170
// < 6333
// not 6473
// not 6617

function compareDifferentTypes(left, right) { // Items are different data types: Integer and array
  const leftArray = Array.isArray(left) ? left : [left];
  const rightArray = Array.isArray(right) ? right : [right];

  console.log('CONVERTED TYPES')
  return compareLists(leftArray, rightArray);
}

function compareLists(left, right) { // Return boolean value
  console.log('COMPARING LISTS');
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i++) {
    if (i >= left.length) {
      console.log('LEFT RAN OUT - CORRECT');
      return true;
    }
    if (i >= right.length) {
      console.log('RIGHT RAN OUT - INCORRECT');
      return false;
    }

    let leftItem = left[i];
    let rightItem = right[i];

    console.log('LEFT', leftItem);
    console.log('RIGHT', rightItem);

    if ([leftItem, rightItem].every(e => Number.isInteger(e))) {
      console.log('ARRAYS TEST COMPARING INTEGERS')

      let integerComparison = compareIntegers(leftItem, rightItem);
      if (integerComparison === undefined) {
        if (i === length - 1) return undefined;
        continue;
      };
      return integerComparison;
    }

    if (Array.isArray(leftItem) && Array.isArray(rightItem)) {
      console.log('BOTH ARE ARRAYS AGAIN, RECURSIVE TEST');

      let arrayComparison = compareLists(leftItem, rightItem)
      if (arrayComparison === undefined) {
        if (i === length - 1) return undefined;
        continue;
      }
      return arrayComparison;
    }

    if ([leftItem, rightItem].filter(e => Array.isArray(e)).length === 1) {
      console.log('ARRAYS TEST DIFFERENT TYPES')

      let integerComparison = compareDifferentTypes(leftItem, rightItem);
      if (integerComparison === undefined) {
        if (i === length - 1) return undefined;
        continue;
      };
      return integerComparison;
    }
  }
}

function compareIntegers(left, right) {
  if ([left, right].some(e => !Number.isInteger(e))) console.log('NON-INTEGERS PASSED TO INTEGER COMPARISON: ', left, right);
  console.log('COMPARING INTEGERS: ', left, right);

  if (left < right) { // Correct
    console.log('LEFT SMALLER - CORRECT')
    return true;
  } else if (left > right) { // Incorrect
    console.log('RIGHT SMALLER - INCORRECT')
    return false;
  } else { // Items are equal, continue checking;
    console.log('INTEGERS EQUAL - CONTINUE')
    return undefined;
  }
}