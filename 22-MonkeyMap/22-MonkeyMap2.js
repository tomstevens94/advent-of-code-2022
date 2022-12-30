var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const split = input.split('\n\n'); // Split into 2 sections =- maze and instructions

const mazeString = split[0]; // Maze as one string
let maze = mazeString.split('\n').map(e => e.split('')); // Maze as rows of strings

const mazeWidth = Math.max(...maze.map(e => e.length));
maze = maze.map((e, i, a) => {
  if (e.length === mazeWidth) return e;

  const spaceToAdd = mazeWidth - e.length;
  const emptySpace = new Array(spaceToAdd).fill(' ');

  return [...e, ...emptySpace];
}); // The lower sections of the maze had rows of different length than the top rows - this add cells so all rows are equal

const instructionsString = split[1];

// let coordinates = { // Starting coordinates
//   x: maze[0].findIndex(e => e === '.'),
//   y: 0
// }

let coordinates = { // Starting coordinates
  x: 50,
  y: 0
}

const testInstructions = ['L', 1, 'R', 100, 'L', 6, 'R', 10];

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

// const edges = {
//   '1': {
//     dir: 1,
//     x: {
//       isRange: true,
//       min: 7,
//       max: 4,
//     },
//     y: {
//       isRange: false,
//       value: 0
//     }
//   },
//   '-1': {
//     dir: 1,
//     x: {
//       isRange: true,
//       min: 0,
//       max: 3
//     },
//     y: {
//       isRange: false,
//       value: 4
//     }
//   },
//   '2': {
//     dir: 2,
//     x: {
//       isRange: false,
//       value: 15
//     },
//     y: {
//       isRange: true,
//       min: 0,
//       max: 3,
//     }
//   },
//   '-2': {
//     dir: 2,
//     x: {
//       isRange: false,
//       value: 11
//     },
//     y: {
//       isRange: true,
//       min: 11,
//       max: 8,
//     }
//   },
//   '3': {
//     dir: 2,
//     x: {
//       isRange: false,
//       value: 11
//     },
//     y: {
//       isRange: true,
//       min: 7,
//       max: 4
//     }
//   },
//   '-3': {
//     dir: 1,
//     x: {
//       isRange: true,
//       min: 12,
//       max: 15
//     },
//     y: {
//       isRange: false,
//       value: 8
//     }
//   },
//   '4': {
//     dir: 3,
//     x: {
//       isRange: true,
//       min: 4,
//       max: 7
//     },
//     y: {
//       isRange: false,
//       value: 7
//     }
//   },
//   '-4': {
//     dir: 0,
//     x: {
//       isRange: false,
//       value: 8
//     },
//     y: {
//       isRange: true,
//       min: 11,
//       max: 8
//     }
//   },
//   '5': {
//     dir: 3,
//     x: {
//       isRange: true,
//       min: 8,
//       max: 11
//     },
//     y: {
//       isRange: false,
//       value: 11
//     }
//   },
//   '-5': {
//     dir: 3,
//     x: {
//       isRange: true,
//       min: 3,
//       max: 0
//     },
//     y: {
//       isRange: false,
//       value: 7
//     }
//   },
//   '6': {
//     dir: 0,
//     x: {
//       isRange: false,
//       value: 0
//     },
//     y: {
//       isRange: true,
//       min: 4,
//       max: 7
//     }
//   },
//   '-6': {
//     dir: 3,
//     x: {
//       isRange: true,
//       min: 19,
//       max: 12
//     },
//     y: {
//       isRange: false,
//       value: 11
//     }
//   },
//   '7': {
//     dir: 0,
//     x: {
//       isRange: false,
//       value: 8
//     },
//     y: {
//       isRange: true,
//       min: 3,
//       max: 0
//     }
//   },
//   '-7': {
//     dir: 1,
//     x: {
//       isRange: true,
//       min: 7,
//       max: 4
//     },
//     y: {
//       isRange: false,
//       value: 4
//     }
//   }
// }

const edges = {
  '1': {
    dir: 1,
    x: {
      isRange: true,
      min: 50,
      max: 99,
    },
    y: {
      isRange: false,
      value: 0
    }
  },
  '-1': {
    dir: 0,
    x: {
      isRange: false,
      value: 0
    },
    y: {
      isRange: true,
      min: 150,
      max: 199
    }
  },
  '2': {
    dir: 1,
    x: {
      isRange: true,
      min: 100,
      max: 149,
    },
    y: {
      isRange: false,
      value: 0
    }
  },
  '-2': {
    dir: 3,
    x: {
      isRange: true,
      min: 0,
      max: 49
    },
    y: {
      isRange: false,
      value: 199
    }
  },
  '3': {
    dir: 2,
    x: {
      isRange: false,
      value: 149
    },
    y: {
      isRange: true,
      min: 49,
      max: 0
    }
  },
  '-3': {
    dir: 2,
    x: {
      isRange: false,
      value: 99
    },
    y: {
      isRange: true,
      min: 100,
      max: 149
    }
  },
  '4': {
    dir: 3,
    x: {
      isRange: true,
      min: 149,
      max: 100
    },
    y: {
      isRange: false,
      value: 49
    }
  },
  '-4': {
    dir: 2,
    x: {
      isRange: false,
      value: 99
    },
    y: {
      isRange: true,
      min: 99,
      max: 50
    }
  },
  '5': {
    dir: 0,
    x: {
      isRange: false,
      value: 50
    },
    y: {
      isRange: true,
      min: 0,
      max: 49
    }
  },
  '-5': {
    dir: 0,
    x: {
      isRange: false,
      value: 0
    },
    y: {
      isRange: true,
      min: 149,
      max: 100
    }
  },
  '6': {
    dir: 0,
    x: {
      isRange: false,
      value: 50
    },
    y: {
      isRange: true,
      min: 99,
      max: 50
    }
  },
  '-6': {
    dir: 1,
    x: {
      isRange: true,
      min: 49,
      max: 0
    },
    y: {
      isRange: false,
      value: 100
    }
  },
  '7': {
    dir: 3,
    x: {
      isRange: true,
      min: 50,
      max: 99
    },
    y: {
      isRange: false,
      value: 149
    }
  },
  '-7': {
    dir: 2,
    x: {
      isRange: false,
      value: 49
    },
    y: {
      isRange: true,
      min: 150,
      max: 199
    }
  }
}

const directions = [ // Start looking right
  'right',
  'down',
  'left',
  'up'
];

function getDirVector(index) { // These can be added to to current coordinates to travel in specific direction
  const dir = directions[index];

  switch (dir) {
    case 'right': return { x: 1, y: 0 };
    case 'down': return { x: 0, y: 1 };
    case 'left': return { x: -1, y: 0 };
    case 'up': return { x: 0, y: -1 };
    default: return;
  }
}

let directionIndex = 0; // Begin facing to the right

let count = 0;
instructions.forEach(inst => {
  count++;
  if (Number.isInteger(inst)) { // Instruction is number - walk

    let blocked = false;
    while (inst > 0 && !blocked) {
      const vector = getDirVector(directionIndex);
      let newCoordinates = handleWrap(coordinates, vector, maze); // Move coordinates and wrap around cube

      if (maze[newCoordinates.y][newCoordinates.x] === '#') { // Blocked by a wall
        blocked = true; // Break the while loop and stop moving
        continue;
      }

      coordinates = newCoordinates; // We aren't blocked so move to the new coordinates
      inst -= 1; // Reduce the distance to travel - this controls the while loop
    }
  } else { // Instruction is string - change of direction
    if (inst === 'R') directionIndex = (directionIndex + 1) % directions.length;
    if (inst === 'L') directionIndex = ((directionIndex - 1) + directions.length) % directions.length;
  }
});

// maze.forEach(e => console.log(e.join('')));

const rowPassword = (coordinates.y + 1) * 1000;
const colPassword = (coordinates.x + 1) * 4;

const password = rowPassword + colPassword + directionIndex;

console.log('PASSWORD', password); // Part 1

// > 86403
// > 26439
// > 15363

function handleWrap(coordinates, vector, maze) {
  let nextCoordinates = { // Direction added to current coordinates without any checks
    x: coordinates.x + vector.x,
    y: coordinates.y + vector.y
  }

  if (
    !maze[nextCoordinates.y] || // Row doesnt exist in maze
    !maze[nextCoordinates.y][nextCoordinates.x] || // Column doesnt exist in map
    maze[nextCoordinates.y][nextCoordinates.x] === ' ' // // Cell is outside walkable area
  ) {
    const prevEdgeId = getPrevEdge(nextCoordinates, vector);
    const prevEdge = edges[prevEdgeId];

    const newEdgeId = (Number(prevEdgeId) * -1).toString();
    const newEdge = edges[newEdgeId];

    const prevRangeEdge = Object.values(prevEdge).find(e => e.isRange); // Find either X or Y from previous edge - whichever was a range and not a value

    let axisOfNoMovement;
    for (const axis in vector) {
      if (vector[axis] === 0) axisOfNoMovement = axis;
    }

    const prevRangeCoordinate = coordinates[axisOfNoMovement]; // Coordinate value perpendicular to movement

    if (newEdge.y.isRange) {
      nextCoordinates.x = newEdge.x.value;
      nextCoordinates.y = (Math.abs(prevRangeCoordinate - prevRangeEdge.min) * Math.sign(newEdge.y.max - newEdge.y.min)) + newEdge.y.min;
    } else if (newEdge.x.isRange) {
      nextCoordinates.x = (Math.abs(prevRangeCoordinate - prevRangeEdge.min) * Math.sign(newEdge.x.max - newEdge.x.min)) + newEdge.x.min;
      nextCoordinates.y = newEdge.y.value;
    }

    if (maze[nextCoordinates.y][nextCoordinates.x] !== '#') {
      directionIndex = newEdge.dir;
    }
  }

  return maze[nextCoordinates.y][nextCoordinates.y] !== '#' ? nextCoordinates : coordinates;
}

function getPrevEdge(nextCoordinates, vector) {
  const { x, y } = nextCoordinates;

  for (const edgeId in edges) {
    const edge = edges[edgeId];

    const matchingVector = getDirVector((edge.dir + 2) % directions.length); // Should match the current vector
    if (vector.x !== matchingVector.x || vector.y !== matchingVector.y) { // Doesnt match - not the right edge
      continue;
    }

    if (edge.x.isRange) {
      const smallestX = Math.min(edge.x.min, edge.x.max);
      const largestX = Math.max(edge.x.min, edge.x.max)
      if (x >= smallestX && x <= largestX) {
        return edgeId;
      }
    } else if (edge.y.isRange) {
      const smallestY = Math.min(edge.y.min, edge.y.max);
      const largestY = Math.max(edge.y.min, edge.y.max)
      if (y >= smallestY && y <= largestY) {
        return edgeId;
      }
    }
  }
}