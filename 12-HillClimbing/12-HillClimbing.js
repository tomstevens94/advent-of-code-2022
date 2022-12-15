var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const rows = input.split('\r\n');

console.log(input, rows);

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const openCells = []; // Cells with a calculated F cost;
const closedCells = []; // Cells with calculated neighbours
const startY = rows.findIndex(e => e.includes('S'));
const startX = rows[startY].split('').findIndex(e => e === 'S');

const endY = rows.findIndex(e => e.includes('E'));
const endX = rows[endY].split('').findIndex(e => e === 'E');

const start = new Node(startX, startY);
const end = new Node(endX, endY);

console.log(start);