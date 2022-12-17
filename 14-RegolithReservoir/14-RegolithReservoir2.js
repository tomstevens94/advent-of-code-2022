var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

let rows = input.split('\n');
rows = rows.map(row => row.split(' -> ').map(coor => coor.split(',').map(e => Number(e)))); // Convert to array of points , each are array of coordinates, each are array of length 2: X and Y (Both numbers - not strings!)

let xMin = Math.min(...rows.map(row => Math.min(...row.map(e => e[0])))) - 35; // Smallest X value, value added to give space around rock
let yMin = Math.min(...rows.map(row => Math.min(...row.map(e => e[1])))); // Smallest Y value
let xMax = Math.max(...rows.map(row => Math.max(...row.map(e => e[0])))) + 150; // Largest X value, value added to give space around rock
let yMax = Math.max(...rows.map(row => Math.max(...row.map(e => e[1])))) + 2; // Largest Y value

console.log('xMin', xMin);
console.log('yMin', yMin);
console.log('xMax', xMax);
console.log('yMax', yMax);

let xSize = (xMax - xMin) + 1; // Width of grid
let ySize = (yMax) + 1; // Height of grid
console.log(ySize)

console.log('WIDTH', xSize);
console.log('HEIGHT', ySize);

let grid = new Array(ySize).fill(0).map(e => new Array(xSize).fill('.')); // Initilise empty grid.

rows.forEach((row) => { // Draw rock on grid
  let previousPoint;

  row.forEach(point => {
    if (!previousPoint) { // On first point, set previous to current
      previousPoint = point;
      let adjX = previousPoint[0] - xMin; // Adjust X coordinate to match input
      let adjY = previousPoint[1];

      grid[adjY][adjX] = '#'; // Draw rock on this point as this will be moved in net step before drawing
      return;
    }

    const xDir = previousPoint[0] === point[0] ? 0 : Math.sign(point[0] - previousPoint[0]); // Either 0, -1, or 1, depending on direction the line will point
    const yDir = previousPoint[1] === point[1] ? 0 : Math.sign(point[1] - previousPoint[1]);

    while (previousPoint.some((e, i) => point[i] !== e)) { // Move previous point towards current, one pixel at a time      
      previousPoint = [previousPoint[0] + xDir, previousPoint[1] + yDir];

      let adjX = previousPoint[0] - xMin;
      let adjY = previousPoint[1];

      grid[adjY][adjX] = '#';
    }
  })
});

grid[grid.length - 1].fill('#'); // Add floor to bottom of grid

const sandStart = [500 - xMin, 0]; // Start location of sand

let totalGrains = 0;
let sourceIsBlocked = false;

while (!sourceIsBlocked) { // Keep adding sand until the source is blocked
  totalGrains++; // Keep track of the amount of grains added
  addSand();
}

grid.forEach(row => console.log(row.join(''))); // Log the entire cave

function addSand() {
  let sand = sandStart; // Initialise first location of sand

  while (canFallFurther(sand)) { // Keep moving sand downwards until it cant fall further
    sand = dropSand(sand);
  }

  grid[sand[1]][sand[0]] = 'o'; // Add sand to grid
}

function dropSand([x, y]) {
  if (x === 0 || x === grid[0].length - 1) { // Sand is on edge - grid needs to be made wider
    console.log('GRID ISNT WIDE ENOUGH');
    return [x, y];
  }

  const spaceBelow = grid[y + 1][x] === '.';
  if (spaceBelow) return [x, y + 1];

  const spaceBelowLeft = grid[y + 1][x - 1] === '.';
  if (spaceBelowLeft) return [x - 1, y + 1];

  const spaceBelowRight = grid[y + 1][x + 1] === '.';
  if (spaceBelowRight) return [x + 1, y + 1];

  return [x, y];
}

function canFallFurther([x, y]) {
  const spaceBelow = grid[y + 1][x] === '.';
  const spaceBelowLeft = grid[y + 1][x - 1] === '.';
  const spaceBelowRight = grid[y + 1][x + 1] === '.';

  if ([x, y].every((e, i) => sandStart[i] === e) && !spaceBelow && !spaceBelowLeft & !spaceBelowRight) { // Source has been blocked
    sourceIsBlocked = true;
    console.log(`The ${totalGrains} grain blocked the source`); // Part 2
    return false;
  }

  if (x === 0 || x === grid[0].length - 1) { // Sand is on one of the edges - grid needs to be made wider
    console.log('GRID ISNT WIDE ENOUGH');
    return false;
  }

  return (spaceBelow || spaceBelowLeft || spaceBelowRight);
}