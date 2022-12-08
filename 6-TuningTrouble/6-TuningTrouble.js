var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const test = 'fddddddddhryfhryfhryfrhry'


const uniqueCharacters = str => {
    let cache = {};

    str.split('').forEach(e => cache[e] = cache[e] + 1 || 1);

    return Object.keys(cache).length === str.length;
}

const uniqueLength = 14;

console.log(input.split('').findIndex((e, i) => uniqueCharacters(input.slice(i, i + uniqueLength))) + uniqueLength);

// const firstIndex = input.split('').findIndex((e, i) => );

// console.log(firstIndex, firstIndex + 4);