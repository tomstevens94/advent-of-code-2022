var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const rucksacks = input.split('\n');

const charToNum = char => alphabet.indexOf(char.toLowerCase()) + 1;

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const values = rucksacks.map(e => {
    const [leftHalf, rightHalf] = [e.slice(0, e.length / 2), e.slice(e.length / 2)];
    const commonDigit = leftHalf.split('').find(e => rightHalf.includes(e));
    const digitValue = commonDigit.toLowerCase() === commonDigit ? charToNum(commonDigit) : charToNum(commonDigit) + 26;

    return digitValue;
});

// console.log(values.reduce((total, num) => total + num, 0)); // Part 1

let groups = [];

while (rucksacks.length > 0) {
    const group = rucksacks.splice(0, 3);
    groups.push(group);
}

const groupValues = groups.map(([a, b, c]) => {
    const commonDigit = a.split('').find(e => b.includes(e) && c.includes(e));
    
    const digitValue = commonDigit.toLowerCase() === commonDigit ? charToNum(commonDigit) : charToNum(commonDigit) + 26; 
    return digitValue;
})

console.log(groupValues.reduce((total, num) => total + num, 0));