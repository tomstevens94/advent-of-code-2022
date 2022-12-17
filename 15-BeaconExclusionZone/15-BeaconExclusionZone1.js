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

const yToCheck = 2000000; // Position of line - check how many points cannot be a beacon

sensors = sensors.sort((a, b) => a.position.x - b.position.x); // Sort sensors by X position

let beaconFreePoints = new Set(); // Points that can't be a beacon - possibly optimise this to store ranges instead of points?

sensors.forEach((sensor, i) => {
  const distanceToLine = Math.abs(yToCheck - sensor.position.y); // Vertical distance to line
  const { distanceToBeacon } = sensor; // Distance to sensor's closest beacon

  const overlap = distanceToBeacon - distanceToLine; // Amount of squares that the sensor can detect over the line

  if (overlap < 0) { // Sensor is not overlapping the line
    console.log(`Sensor ${i} does not overlap the line`);
    return;
  }
  if (overlap === 0) { // Sensor can detect exactly up to the line
    beaconFreePoints.add(sensor.position.x); // Sensor overlaps only at this one point
    return;
  }
  let pointsMin = sensor.position.x - overlap; // Left-most point of detection on the line
  const pointsMax = sensor.position.x + overlap; // Right-most point of detection on the line
  while (pointsMin < pointsMax) { // Add all points to set
    beaconFreePoints.add(pointsMin);
    pointsMin++;
  }
  beaconFreePoints.add(pointsMin); // Add final point to set
  if (sensor.closestBeacon.y === yToCheck) { // If beacon is on the line, remove it from the array
    console.log('REMOVED BEACON', sensor.closestBeacon);
    beaconFreePoints.delete(sensor.closestBeacon.x);
  }
});

console.log(beaconFreePoints.size); // Part 1