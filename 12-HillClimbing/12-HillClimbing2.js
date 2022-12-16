var fs = require('fs');
const { start } = require('repl');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
let rows = input.split('\r\n');

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = this.calculateHeight(x, y);

    this.gCost; // Distance from start node, along path
    this.hCost; // Distance directly to end node
    this.fCost; // Sum of gCost and hCost

    this.parent; // Previous node in path
  }
  calculateHeight(x, y) {
    const char = rows[y][x];
    return char.toLowerCase().charCodeAt(0) - 97;
  }
  calculateFCost() {
    this.fCost = this.gCost + this.hCost;
  }
  calculateHCost({x, y}) { // Calculate H cost based on distance to end node
    const xDist = Math.abs(x - this.x);
    const yDist = Math.abs(y - this.y);

    this.hCost = xDist + yDist;
  }
  sameLocation({x, y}) {
    return x === this.x && y === this.y;
  }
}

// const startY = rows.findIndex(e => e.includes('S')); // Get coordinates for start node
// const startX = rows[startY].split('').findIndex(e => e === 'S');

const endY = rows.findIndex(e => e.includes('E')); // Get coordinates for end node
const endX = rows[endY].split('').findIndex(e => e === 'E');

rows = rows.map(row => row.replace('S', 'a').replace('E', 'z')); // Change start and end to elevation value

// Start with array of coordinates and map them to smallest step values, then choose smallest value in array
let startCoordinates = [];
rows.forEach((row, y) => row.split('').forEach((h, x) => {if (h === 'a') startCoordinates.push([x, y])}))

startCoordinates = startCoordinates.map(([x, y]) => {
  const openNodes = []; // Nodes with a calculated F cost;
  const closedNodes = []; // Nodes with calculated neighbours

  const startNode = new Node(x, y);
  const endNode = new Node(endX, endY);

  startNode.gCost = 0;
  startNode.calculateHCost(endNode);
  startNode.calculateFCost();

  openNodes.push(startNode);

  let currentNode = startNode;
  while (!currentNode.sameLocation(endNode)) {
    const sortedNodes = openNodes.sort((a, b) => a.fCost - b.fCost); // Sort by F cost
    currentNode = sortedNodes.splice(0, 1)[0]; // Remove first node from open array (lowest F cost)
    closedNodes.push(currentNode); // Add node to closed list

    if (!currentNode) {
      return undefined;
    }
    if (currentNode.sameLocation(endNode)) console.log('PATH FOUND'); // If current is in same location as end node, then the path has been found

    // Find all neighbours
    let {x, y} = currentNode; // Coordinates of current node

    let neighbours = [ // Coordinates of all neighbours
      [x, y - 1],
      [x, y  + 1],
      [x - 1, y],
      [x + 1, y]
    ];

    neighbours = neighbours
      .filter(([x, y]) => (x >= 0 && x < rows[0].length && y >= 0 && y < rows.length)) // Valid coordinates
      .map(([x, y]) => new Node(x, y)) // Convert coordinates to Nodes
      .filter(node => {
        const isClosed = closedNodes.some(node1 => node1.sameLocation(node)) // Remove node if it is in closed array
        const invalidHeight = node.height > currentNode.height + 1; // Remove node if height is too high
        return !isClosed && !invalidHeight;
      }); 

    neighbours.forEach(node => {
      const gCost = currentNode.gCost + 1;

      let openNeighbour = openNodes.find(node1 => node1.sameLocation(node));
      const pathIsLonger = openNeighbour && openNeighbour.gCost < gCost;

      if (openNeighbour && pathIsLonger) return; // We already have a better path calculated, return

      if (openNeighbour === undefined) { // If neighbour was not in open array, we set it to neighbour, and add it to array
        openNeighbour = node;
        openNodes.push(openNeighbour);
      }

      openNeighbour.gCost = gCost;
      openNeighbour.calculateHCost(endNode);
      openNeighbour.calculateFCost();
      openNeighbour.parent = currentNode;
    })
  }

  let steps = 0;
  let currentNodeInPath = currentNode;
  while (!currentNodeInPath.sameLocation(startNode)) { // Loop through nodes from end to start through parents, adding 1 step each time
    currentNodeInPath = currentNodeInPath.parent;
    steps++;
  }
  return steps;
});

const startingLength = startCoordinates.length;
startCoordinates = startCoordinates.filter(e => e !== undefined);
const shortestPath = startCoordinates.sort((a, b) => a - b)[0];

console.log('STARTING LENGTH', startingLength); // Part 2
console.log('FILTERED LENGTH', startCoordinates.length);
console.log('SHORTEST PATH', shortestPath);