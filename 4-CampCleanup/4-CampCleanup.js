var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const pairs = input.split('\n').map(e => e.replace('\r', '').split(','));
console.log(pairs)

const containedPairs = pairs.filter(([leftRange, rightRange]) => {
    const [leftMin, leftMax] = leftRange.split('-').map(e => Number(e));
    const [rightMin, rightMax] = rightRange.split('-').map(e => Number(e));

    // console.log(leftMin, leftMax, rightMin, rightMax);
    
    const leftWithinRight = (leftMin >= rightMin) && (leftMax <= rightMax) // Left is within right
    const rightWithinLeft = (rightMin >= leftMin) && (rightMax <= leftMax) // Right is within left

    // console.log(leftWithinRight || rightWithinLeft);

    return (leftWithinRight || rightWithinLeft);
});

// console.log(containedPairs.length); // Part 1

const overlappingPairs = pairs.filter(([leftRange, rightRange]) => {
    const [leftMin, leftMax] = leftRange.split('-').map(e => Number(e));
    const [rightMin, rightMax] = rightRange.split('-').map(e => Number(e));
    
    const leftOverlapsRight = (leftMax >= rightMin) && (leftMin <= rightMin) // Left overlaps right
    const rightOverlapsLeft = (rightMin <= leftMax) && (rightMax >= leftMin) // Right overlaps left

    return (leftOverlapsRight || rightOverlapsLeft);
})

console.log(overlappingPairs.length); // Part 2