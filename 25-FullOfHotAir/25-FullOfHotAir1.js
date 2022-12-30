
var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

let inputSNAFU = input.split('\n'); // Array of SNAFU values
let inputDecimal = inputSNAFU.map(e => convertFromSnafu(e)); // Array of decimal values
let inputSum = inputDecimal.reduce((total, num) => total + num, 0); // Total decimal value
let sumSNAFU = convertToSnafu(inputSum); // Total SNAFU value

console.log(sumSNAFU); // Part 1

// Number is in base 5, and digits are converted as below:

// 2 = 2
// 1 = 1
// 0 = 0
// -1 = -
// -2 = =

// Each digit is another power of five, 324 (in base 5) is:
// (3 * 5^2) + 
// (2 * 5^1) + 
// (4 * 5^0)
// Equals 75 + 10 + 4 = 89 (in base 10 - 'normal')

function convertFromSnafu(str) {
  if (typeof str !== 'string') str = str.toString();

  return str
    .split('') // Convert string to array of digits
    .map(e => {
      switch (e) {
        case '2': return 2;
        case '1': return 1;
        case '0': return 0;
        case '-': return -1;
        case '=': return -2;
        default: console.log('ERROR - NOT A SNAFU DIGIT'); return undefined;
      }
    })
    .map((e, i, a) => e * Math.pow(5, ((a.length - 1) - i))) // Convert each digit to corresponding value
    .reduce((total, num) => total + num, 0); // Add up all values
}

function convertToSnafu(num) {
  // SNAFU is a number in base five, using values below instead of 4, 3, 2, 1, 0
  // -1 is represented with '-', and -2 is represented with '=' ...because
  num = Number(num);

  const multipliers = [2, 1, 0, -1, -2]; // These are the values we use instead of usual digits

  let digits = [];
  let target = num;

  while (target !== 0) {
    console.log(target);
    let power;
    let powerToTest = 0;

    while (power === undefined) { // Find which power will get us closest to target
      let powerArray = new Array(powerToTest + 1).fill(0).map((_, i) => i); // Array includes all powers leading to current

      let bounds = powerArray // Current power can achieve anything between bounds and -bounds
        .map(e => Math.pow(5, e) * 2) // Map each power to the max value with given digits
        .reduce((total, num) => total + num, 0); // Add all powers together


      if (bounds >= Math.abs(target)) { // Target is within bounds
        console.log(powerToTest);
        power = powerToTest; // Set power to the one being tested - this will exit the while loop
        continue;
      }

      powerToTest++; // Active power does not reach target - increment and try again
    }

    const digitValue = Math.pow(5, power);

    const closestMultiplier = multipliers
      .sort((a, b) => Math.abs(target - (a * digitValue)) - Math.abs(target - (b * digitValue)))[0]; // Multiplier that will get us closest to target

    console.log(closestMultiplier);

    if (digits.length === 0) { // First time adding to array, we need to set the correct length
      digits = new Array(power + 1).fill(0);
    }

    digits[(digits.length - 1) - power] = closestMultiplier; // Set appropriate array item to multiplier - this will allow some digits to be zero without being calculated
    target -= (closestMultiplier * digitValue); // Decrement target number
  }

  return digits.map(e => {
    return e === -1 ? '-' : e === -2 ? '=' : e;
  }).join('');
}