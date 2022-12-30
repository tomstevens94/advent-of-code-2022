var fs = require('fs');
const { XML_SPACE_TRIM } = require('lite/src/main/js/parse/parse-xml');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const inputGrid = input.split('\n');

const elves = [];

class Elf {
  constructor(x, y, id) {
    this.position = new Vec2(x, y);
    this.proposedPosition;

    this.id = id;
  }
  getNeighbours(otherElves, dir) {
    const allNeighbours = otherElves.filter(elf => Math.abs(elf.position.y - this.position.y) < 2 && Math.abs(elf.position.x - this.position.x) < 2); // All elves within one square

    switch (dir) {
      case 'ALL': return allNeighbours;
      case 'N': return allNeighbours.filter(elf => elf.position.y === this.position.y - 1);
      case 'S': return allNeighbours.filter(elf => elf.position.y === this.position.y + 1);
      case 'W': return allNeighbours.filter(elf => elf.position.x === this.position.x - 1);
      case 'E': return allNeighbours.filter(elf => elf.position.x === this.position.x + 1);
      default: console.log('INCORRECT DIRECTION'); return undefined;
    }
  }
  confirmMovement(otherElves) {
    if (!this.proposedPosition) return;

    const conflicts = otherElves.filter(elf => elf.proposedPosition && elf.proposedPosition.equals(this.proposedPosition));

    if (conflicts.length === 0) { // No other elves have proposed to move here
      this.position = this.proposedPosition; // Set our position to proposed position
      this.proposedPosition === undefined; // Reset proposed position
    } else { // Other elves have proposed to move here
      conflicts.forEach(elf => elf.proposedPosition = undefined); // Reset other elves proposed position without moving
      this.proposedPosition === undefined; // Reset proposed position without moving
    }
  }
  proposeMovement(otherElves, directions) {
    const neighbours = this.getNeighbours(otherElves, 'ALL');
    if (neighbours.length === 0) return; // No elves around - don't move

    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      const neighboursInDirection = this.getNeighbours(otherElves, dir);

      if (neighboursInDirection.length === 0) {
        this.proposedPosition = this.position.addDirection(dir);
        return;
      }
    }
  }
}

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  addDirection(dir) {
    switch (dir) {
      case 'N': return new Vec2(this.x, this.y - 1);
      case 'S': return new Vec2(this.x, this.y + 1);
      case 'W': return new Vec2(this.x - 1, this.y);
      case 'E': return new Vec2(this.x + 1, this.y);
      default: console.log('INCORRECT DIR IN VEC2 CLASS'); return undefined;
    }
  }
  equals(vec) {
    return this.x === vec.x && this.y === vec.y;
  }
}

let elfID = 0;
inputGrid.forEach((row, y) => row.split('').forEach((cell, x) => { // Create elves from input
  if (cell !== '#') return;

  elves.push(new Elf(x, y, elfID));
  elfID++;
}));

let directions = [
  'N',
  'S',
  'W',
  'E'
]

simulateRounds(10, elves, directions);

function simulateRounds(rounds, elves, directions) {
  for (let i = 0; i < rounds; i++) {
    console.log(directions);
    simulateSingleRound(elves, directions);
    directions = [...directions.slice(1), directions[0]];
  }
  createGrid(elves); // Log updated grid to terminal
}

function simulateSingleRound(elves, directions) {
  elves.forEach(elf => {
    const otherElves = elves.filter(otherElf => otherElf.id !== elf.id);
    elf.proposeMovement(otherElves, directions);
  });
  elves.forEach(elf => {
    const otherElves = elves.filter(otherElf => otherElf.id !== elf.id);
    elf.confirmMovement(otherElves, directions);
  });
}

function createGrid(elves) { // Log final grid in terminal and calculate empty ground tiles
  const x = elves.map(elf => elf.position.x); // All x values of elves
  const xMin = Math.min(...x); // X position of elf that is furthest west
  const xMax = Math.max(...x); // X position of elf that is furthest east

  const y = elves.map(elf => elf.position.y); // All x values of elves
  const yMin = Math.min(...y); // Y position of elf that is furthest north
  const yMax = Math.max(...y); // Y position of elf that is furthest north

  const xSize = (xMax - xMin) + 1; // Amount of rows in grid
  const ySize = (yMax - yMin) + 1; // Amount of cols in grid

  const grid = new Array(ySize).fill(0).map(e => new Array(xSize).fill('.')); // Empty gris with no elves

  elves.forEach(elf => {
    grid[elf.position.y - yMin][elf.position.x - xMin] = '#'; // Add symbol in grid corresponsing to elf position
  })

  grid.forEach(e => console.log(e.join(''))); // Log out grid to terminal
  const totalGridTiles = grid.length * grid[0].length; // Area of grid
  const totalGroundTiles = totalGridTiles - elves.length; // Total amount of empty floor space

  console.log(totalGroundTiles); // Part 1
}