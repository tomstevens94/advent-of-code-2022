var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./smallInput.txt");

let rows = input.split('\n');
rows = rows.map(row => row.split(' -> ').map(coor => coor.split(',').map(e => Number(e)))); // Convert to array of points , each are array of coordinates, each are array of length 2: X and Y (Both numbers - not strings!)

console.log(rows)

let xMin = Math.min(...rows.map(row => Math.min(...row.map(e => e[0])))) - 1; // Smallest X value, value added to give space around rock
let yMin = Math.min(...rows.map(row => Math.min(...row.map(e => e[1])))); // Smallest Y value
let xMax = Math.max(...rows.map(row => Math.max(...row.map(e => e[0])))) + 5; // Largest X value, value added to give space around rock
let yMax = Math.max(...rows.map(row => Math.max(...row.map(e => e[1])))) + 10; // Largest Y value

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
    if (!previousPoint) { // On first point, set previous to current and return
      previousPoint = point;
      let adjX = previousPoint[0] - xMin;
      let adjY = previousPoint[1];

      grid[adjY][adjX] = '#';
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

const sandStart = [500 - xMin, 0];

let totalGrains = 0;
let fallingIntoVoid = false;

while (!fallingIntoVoid) {
  totalGrains++;
  addSand();
}

grid.forEach(row => console.log(row.join('')));
console.log(`Total grains rested beore falling into void: ${totalGrains}`);

// not: 1299 1298

function addSand() {
  let sand = sandStart;

  while (canFallFurther(sand)) {
    sand = dropSand(sand);
  }

  grid[sand[1]][sand[0]] = 'o';
}

function dropSand([x, y]) {
  if (x === 0) { // Sand is on left edge
    if (grid[y + 1][x] === '.') { // Space below
      return [x, y + 1];
    } else if (grid[y + 1][x + 1] === '.') { // Space below-right
      return [x + 1, y + 1];
    }
  } else if (x === grid[0].length - 1) { // Sand is on right edge
    if (grid[y + 1][x] === '.') { // Space below
      return [x, y + 1];
    } else if (grid[y + 1][x - 1] === '.') { // Space below-left
      return [x - 1, y + 1];
    }
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
  if (y === grid.length - 1) {
    fallingIntoVoid = true; // Sand has reached the bottom of the screen
    console.log(`The ${totalGrains} grain fell into the void`);
    totalGrains--; // Remove one from total grains as the most recent one fell into the void
    return false;
  }

  if (x === 0) { // Sand is on left edge
    if (grid[y + 1][x] === '.' || grid[y + 1][x + 1] === '.') { // Space below or below-right
      return true;
    } else return false;
  } else if (x === grid[0].length - 1) { // Sand is on right edge
    if (grid[y + 1][x] === '.' || grid[y + 1][x - 1] === '.') { // Space below or below-left
      return true;
    } else return false;
  }

  const spaceBelow = grid[y + 1][x] === '.';
  const spaceBelowLeft = grid[y + 1][x - 1] === '.';
  const spaceBelowRight = grid[y + 1][x + 1] === '.';

  return (spaceBelow || spaceBelowLeft || spaceBelowRight);
}