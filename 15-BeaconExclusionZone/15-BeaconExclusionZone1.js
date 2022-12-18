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


sensors = sensors.sort((a, b) => a.position.x - b.position.x); // Sort sensors by X position

const yToCheck = 2000000; // Position of line - check how many points cannot be a beacon

let overlapRanges = [];

// Each sensor has a diamond shaped area it scans, that spans to its nearest beacon. The beacon is always on the edge of this diamond, so none of the internal points within the diamond can possibly contain another beacon

sensors.forEach((sensor, i) => {
  const distanceToLine = Math.abs(yToCheck - sensor.position.y); // Vertical distance to line
  const { distanceToBeacon } = sensor; // Distance to sensor's closest beacon

  const overlap = distanceToBeacon - distanceToLine; // Amount of squares that the sensor can detect over the line

  if (overlap < 0) { // Sensor is not overlapping the line
    console.log(`Sensor ${i} does not overlap the line`);
    return;
  }
  const pointsMin = sensor.position.x - overlap; // Left-most point of detection on the line
  const pointsMax = sensor.position.x + overlap; // Right-most point of detection on the line
  const range = [pointsMin, pointsMax]; // Range of points on line that sensor is covering

  let overlappingIndex = overlapRanges.findIndex(e => e[1] >= range[0] && e[0] <= range[1]); // Index of a possible overlapping range
  if (overlappingIndex !== -1) {
    const overlappingRange = overlapRanges[overlappingIndex];

    let newRange = [Math.min(overlappingRange[0], range[0]), Math.max(overlappingRange[1], range[1])]; // Combination of overlapping ranges
    overlapRanges[overlappingIndex] = newRange; // Replace existing range to include current range
  } else {
    overlapRanges.push(range); // Add range to array
  }
});

const beaconsOnLine = new Set(sensors.filter(sensor => sensor.closestBeacon.y === yToCheck).map(sensor => sensor.closestBeacon.x)).size; // X position of each beacon added to set

let beaconFreePoints = overlapRanges.reduce((total, range) => { // Add up all ranges
  const amount = (range[1] - range[0] + 1); // Total amount covered by range

  return total + amount;
}, 0) - beaconsOnLine; // Remove beacons that are on the line from the total

console.log(beaconFreePoints); // Part 1

// 5688618