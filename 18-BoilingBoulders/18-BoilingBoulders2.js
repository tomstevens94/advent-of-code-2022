var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const cubes = input.split('\n').map(e => e.split(',').map(e => Number(e)));

// const cubes = [
//   [2, 2, 2],
//   [1, 2, 2],
//   [3, 2, 2],
//   [2, 1, 2],
//   [2, 3, 2],
//   [2, 2, 1],
//   [2, 2, 3],
//   [2, 2, 4],
//   [2, 2, 6],
//   [1, 2, 5],
//   [3, 2, 5],
//   [2, 1, 5],
//   [2, 3, 5]
// ];

let boundingBox = [];

const xMin = Math.min(...cubes.map(e => e[0])) - 1;
const yMin = Math.min(...cubes.map(e => e[1])) - 1;
const zMin = Math.min(...cubes.map(e => e[2])) - 1;

const xMax = Math.max(...cubes.map(e => e[0])) + 1;
const yMax = Math.max(...cubes.map(e => e[1])) + 1;
const zMax = Math.max(...cubes.map(e => e[2])) + 1;

console.log(xMin, yMin, zMin);
console.log(xMax, yMax, zMax);

for (let x = xMin; x <= xMax; x++) {
  for (let y = xMin; y <= yMax; y++) {
    for (let z = xMin; z <= zMax; z++) {
      boundingBox.push([x, y, z]);
    }
  }
}

const outsideConnector = [0, 0, 0]; // Point that is known to be outside of shape

const exterior = getAllNeighbours([0, 0, 0], cubes);
console.log(exterior);

// const exteriorSurfaceArea = boundingBox.filter((cube, i, a) => {
//   if (cubes.findIndex(e => e.every((e1, i) => e1 === cube[i])) !== -1) return false; // Cube is not air

//   const neighbours = getAllNeighbours([cube], cubes);
//   // if (!isInShape(outsideConnector, neighbours)) console.log(neighbours);


//   // if (neighbours.includes(outsideConnector)) return false; // Air pocket leads to outside of shape

//   return true; // Air pocket is trapped inside shape
// })

const surfaceArea = calculateSurfaceArea(cubes);
// const airPocketSurfaceArea = calculateSurfaceArea(airPockets);

// const total = surfaceArea - airPocketSurfaceArea;
console.log(surfaceArea); // Part 2

function calculateSurfaceArea(cubes) {
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;
  let front = 0;
  let back = 0;

  cubes.forEach(([x, y, z], i, a) => {
    // Loop through every cube - check if a cube exists above current position. If not cube exists, add one to top. Repeat for all 6 sides on all cubes
    if (!isInShape([x, y - 1, z], a)) { // Top
      top++;
    }
    if (!isInShape([x, y + 1, z], a)) { // Bottom
      bottom++;
    }
    if (!isInShape([x - 1, y, z], a)) { // Left
      left++;
    }
    if (!isInShape([x + 1, y, z], a)) { // Right
      right++;
    }
    if (!isInShape([x, y, z - 1], a)) { // Front
      front++;
    }
    if (!isInShape([x, y, z + 1], a)) { // Back
      back++;
    }
  });

  const surfaceArea = [
    top,
    bottom,
    left,
    right,
    front,
    back
  ].reduce((total, num) => total + num, 0);

  return surfaceArea;
}

function getAllNeighbours(startPoint, shape) {
  const neighbours = [startPoint];

  getMoreNeighbours();

  function getMoreNeighbours() {
    let newNeighbours = nextLayerOfNeighbours();
    if (newNeighbours.length > 0) {
      neighbours.push(...newNeighbours);
      // console.log(neighbours.length);
      getMoreNeighbours();
    }
  }

  return neighbours;

  function nextLayerOfNeighbours() {
    let neighboursToAdd = [];

    neighbours.forEach(cube => {
      const [x, y, z] = cube;

      const above = [x, y - 1, z];
      const below = [x, y + 1, z];
      const left = [x - 1, y, z];
      const right = [x + 1, y, z];
      const front = [x, y, z - 1];
      const back = [x, y, z + 1];

      const filteredNeighbours = [above, below, left, right, front, back]
        .filter(([x, y, z]) => x >= xMin && x <= xMax && y >= yMin && y <= yMax && z >= zMin && z <= zMax) // Within bounds
        .filter(cube1 => !isInShape(cube1, shape)) // Is air
        .filter(cube1 => !isInShape(cube1, [...neighbours, ...neighboursToAdd])) // Neighbour is not already included in array

      neighboursToAdd.push(...filteredNeighbours);
    })

    return neighboursToAdd;
  }
}

function isInShape(point, shape) {
  return shape.findIndex(e => e.every((e1, i) => e1 === point[i])) !== -1;
}