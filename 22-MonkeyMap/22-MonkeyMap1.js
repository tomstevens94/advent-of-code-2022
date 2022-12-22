var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const split = input.split('\n\n'); // Split into 2 sections =- maze and instructions

const mazeString = split[0]; // Maze as one string
let maze = mazeString.split('\n').map(e => e.split('')); // Maze as rows of strings
maze = maze.map((e, i, a) => {
  if (e.length === a[0].length) return e;

  const spaceToAdd = a[0].length - e.length;
  const emptySpace = new Array(spaceToAdd).fill(' ');

  return [...e, ...emptySpace];
}); // The lower sections of the maze had rows of different length than the top rows - this add cells so all rows are equal

const instructionsString = split[1];

let coordinates = { // Starting coordinates
  x: maze[0].findIndex(e => e === '.'),
  y: 0
}

const onlyNumbers = /^\d+$/; // Regex to test if a string contains only numbers

let instructions = []; // Initilised array to be looped through
let instruction = ''; // As the distance instructions are strings and will be split, we will add them here before converting back to a number - eg to avoid 45 becoming 4, 5

instructionsString.split('').forEach((e, i, a) => {
  if (onlyNumbers.test(e)) { // e is a number - store and continue to next digit
    instruction += e; // Add another digit to stored number - ie 2 + 3 = 23
    if (i === a.length - 1) { // End of array add stored number to array
      instructions.push(Number(instruction));
      instruction = '';
    }
  } else { // e is a change of direction and not a number
    instructions.push(Number(instruction), e); // Add stored number and direction to array
    instruction = '';
  }
})

const directions = [ // Start looking right
  'right',
  'down',
  'left',
  'up'
];

function getDirVector(dir) { // These can be added to to current coordinates to travel in specific direction
  switch (dir) {
    case 'right': return { x: 1, y: 0 };
    case 'down': return { x: 0, y: 1 };
    case 'up': return { x: 0, y: -1 };
    case 'left': return { x: -1, y: 0 };
    default: {
      console.log('INCORRECT DIRECTION');
      return undefined;
    }
  }
}

let directionIndex = 0; // Begin facing to the right

instructions.forEach(inst => {
  if (Number.isInteger(inst)) { // Instruction is number - walk
    const vector = getDirVector(directions[directionIndex]);
    let blocked = false;
    while (inst > 0 && !blocked) {
      let newCoordinates = handleWrap(coordinates, vector, maze); // Wrap to the opposite edge of the map if applicable

      if (maze[newCoordinates.y][newCoordinates.x] === '#') { // Blocked by a wall
        blocked = true; // Break the while loop and stop moving
        continue;
      }

      coordinates = newCoordinates; // We aren't blocked so move to the new coordinates
      inst -= 1; // Reduce the distance to travel - this controls the while loop

      maze = maze.map((row, y) => y !== coordinates.y ? row : row.map((e, x) => x !== coordinates.x ? e : e === '#' ? '!' : 'o')); // Add our location to the maze
    }
  } else { // Instruction is string - change of direction
    if (inst === 'R') directionIndex = (directionIndex + 1) % directions.length;
    if (inst === 'L') directionIndex = ((directionIndex - 1) + directions.length) % directions.length;
  }
})

// ! - We walked over a wall - ERRO
// o - Current coordinates

maze.forEach((row, y) => console.log(row.join(''))); // Console log out maze
const rowPassword = (coordinates.y + 1) * 1000;
const colPassword = (coordinates.x + 1) * 4;

const password = rowPassword + colPassword + directionIndex;
console.log('PASSWORD', password); // Part 1

function handleWrap(coordinates, vector, maze) {
  let nextCoordinates = { // Direction added to current coordinates without any checks
    x: coordinates.x + vector.x,
    y: coordinates.y + vector.y
  }
  if (!maze[nextCoordinates.y] || !maze[nextCoordinates.y][nextCoordinates.x] || maze[nextCoordinates.y][nextCoordinates.x] === ' ') { // Next coordinates aren't allowed
    console.log('WRAPPING', vector);
    if (vector.y < 0) { // Trying to go up
      nextCoordinates.y += maze.map(e => e[nextCoordinates.x]).filter(e => e !== ' ').length;
    }
    if (vector.y > 0) { // Trying to go down
      nextCoordinates.y = maze.map(e => e[nextCoordinates.x]).findIndex(e => e !== ' ');
    }
    if (vector.x < 0) { // Trying to go left
      nextCoordinates.x += maze[nextCoordinates.y].filter(e => e !== ' ').length;
    }
    if (vector.x > 0) { // Trying to go right
      nextCoordinates.x = maze[nextCoordinates.y].findIndex(e => e !== ' ');
    }
  }

  return nextCoordinates;
}