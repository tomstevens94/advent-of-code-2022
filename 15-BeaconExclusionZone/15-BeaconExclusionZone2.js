var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const rows = input.split('\n');
let sensors = rows.map(input => { // Create array of sensor objects
  const split = input.split(' ');

  const posX = Number(split[2].slice(2, -1));
  const posY = Number(split[3].slice(2, -1));

  const beaconX = Number(split[8].slice(2, -1));
  const beaconY = Number(split[9].slice(2));

  return {
    position: {
      x: posX,
      y: posY
    },
    closestBeacon: {
      x: beaconX,
      y: beaconY,
    },
    distanceToBeacon: Math.abs(posX - beaconX) + Math.abs(posY - beaconY)
  }
})


sensors = sensors.sort((a, b) => a.position.x - b.position.x); // Sort sensors by X position;

for (let i = 0; i <= 4000000; i++) {
  const yToCheck = i; // Position of line - check how many points cannot be a beacon

  let overlapRanges = [];

  // Each sensor has a diamond shaped area it scans, that spans to its nearest beacon. The beacon is always on the edge of this diamond, so none of the internal points within the diamond can possibly contain another beacon

  sensors.forEach((sensor, sensorIndex) => {
    const distanceToLine = Math.abs(yToCheck - sensor.position.y); // Vertical distance to line
    const { distanceToBeacon } = sensor; // Distance to sensor's closest beacon

    const overlap = distanceToBeacon - distanceToLine; // Amount of squares that the sensor can detect over the line

    if (overlap < 0) { // Sensor is not overlapping the line
      // console.log(`Sensor ${i} does not overlap the line`);
      return;
    }
    const pointsMin = sensor.position.x - overlap; // Left-most point of detection on the line
    const pointsMax = sensor.position.x + overlap; // Right-most point of detection on the line
    const range = [pointsMin, pointsMax]; // Range of points on line that sensor is covering

    overlapRanges.push(range);
  });

  overlapRanges = flattenRanges(overlapRanges);

  if (overlapRanges.length > 1) { // Usually one range will cover the entire row, but if one space is not included, there will be two ranges
    const x = overlapRanges[0][1] + 1;
    const y = i;
    console.log('Y COORDINATE: ', y);
    console.log('X COORDINATE: ', x);
    console.log('TUNING FREQUENCY: ', (x * 4000000) + y); // Part 2
  }
};

function flattenRanges(ranges) { // Take array of overlapping ranges and return ones that dont overlap ie [[2-5][3-8][9-11]] -> [[2-8][9-11]]
  const sortedRanges = ranges.sort((a, b) => a[0] - b[0]); // Sort by min value

  let flattenedRanges = [sortedRanges[0]];

  sortedRanges.slice(1).forEach(range => { // Loop through all but first element, as this is already added
    let activeRange = flattenedRanges[flattenRanges.length - 1]; // Add to final element of flattened array

    if (range[0] > activeRange[1]) { // Range does not overlap with flattened ranges
      flattenedRanges.push(range);
      return;
    }

    if (range[1] < activeRange[1]) { // Range sits within existing range and is not useful
      return;
    }

    activeRange = [activeRange[0], range[1]];
    flattenedRanges.splice(-1, 1, activeRange); // Extend active range and replace
  })

  flattenedRanges[0][0] = Math.max(0, flattenedRanges[0][0]);
  flattenedRanges[flattenedRanges.length - 1][1] = Math.min(4000000, flattenedRanges[flattenedRanges.length - 1][1]);

  return flattenedRanges;
}