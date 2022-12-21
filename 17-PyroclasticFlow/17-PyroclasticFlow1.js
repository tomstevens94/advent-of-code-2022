var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");
const directions = input.split('');

const rocks = [
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1],
    [1],
    [1],
    [1]
  ],
  [
    [1, 1],
    [1, 1]
  ]
];

const rockStack = simulateRocks(2022);
console.log(rockStack.finalGroupHeight + rockStack.storedChamberHeight);  // Part 1

processPatternData(simulateRocks(5000).groups);

function simulateRocks(totalRocks, dirStart = 0, rockStart = 0) {
  const chamberWidth = 7;
  let chamber = new Array(10).fill(0).map(e => new Array(chamberWidth).fill(0));
  let storedChamberHeight = 0; // Add this to hamber array height to get total height

  let rockIndex = rockStart; // What type of rock to use
  let rock = rocks[rockIndex];
  let rockY = newRockHeight(rock, chamber);
  let rockX = 2; // Start with 2 spaces on the left
  let data = { groups: [] };

  let directionIndex = dirStart;
  let rockCount = 0;

  while (rockCount < totalRocks) {
    let dir = directions[directionIndex];

    dir = dir === '<' ? -1 : 1;

    rockX += dir; // Move to side
    if (rockCollides(rock, rockX, rockY, chamber)) { // Move back if it colldes
      rockX -= dir;
    } else {
      // console.log(`GAS MOVED ROCK ${rockIndex} ${dir} to: ${rockX} ${rockY}`);
    }

    rockY++; // Move down
    if (rockCollides(rock, rockX, rockY, chamber)) {
      // console.log('ROCK SETTLED');
      rockY--; // Move back if it collides

      addRock(rock, rockX, rockY, chamber); // Add rock to chamber
      rockCount++;

      // if (rockCount === 1010) console.log('EXCESS', chamber.length, storedChamberHeight)

      const fullRowIndex = chamber.findIndex(e => e.every(e1 => e1 === 1));
      if (fullRowIndex !== -1) {
        const chamberToRemove = chamber.splice(fullRowIndex); // Section starts with full row - no rocks can enter so no need to keep
        storedChamberHeight += chamberToRemove.length;

        data.groups.push({ // When removing section of chamber - add to array to process later
          height: chamberToRemove.length,
          dirIndex: directionIndex,
          rockIndex,
          rockCount
        });
      }


      rockIndex = (rockIndex + 1) % rocks.length; // New Rock
      rock = rocks[rockIndex];

      chamber = extendChamber(rock, chamber); // Add space to chamber

      rockX = 2;
      rockY = newRockHeight(rock, chamber);
    } else {
      // console.log(`GRAVITY MOVED ROCK ${rockIndex} ${dir} to: ${rockX} ${rockY}`);
    }

    directionIndex++;
    directionIndex = directionIndex % directions.length
  }

  data.finalGroupHeight = chamber.filter(e => e.some(e1 => e1 === 1)).length;
  data.storedChamberHeight = storedChamberHeight;

  return data;
}

function newRockHeight(rock, chamber) { // Determine starting position of new rock
  let firstRock = chamber.findIndex(e => e.some(e1 => e1 !== 0)); // Position of highest rock in chamber: -1 if chamber is empty
  let edge = firstRock === -1 ? chamber.length : firstRock; // Y position of either 
  return (edge - 3) - rock.length;
}

function extendChamber(rock, chamber) { // Add space to chamber
  const firstRock = chamber.findIndex(e => e.includes(1));

  const edge = firstRock < 0 ? chamber.length : firstRock; // Either first rock or bottom of chamber

  const spaceNeeded = rock.length + 3;
  const spaceToAdd = spaceNeeded - edge;

  if (spaceToAdd <= 0) return chamber; // No space needed

  let emptyRows = new Array(spaceToAdd).fill(0).map(e => new Array(chamber[0].length).fill(0));
  return [...emptyRows, ...chamber];
}

function rockCollides(rock, rockX, rockY, chamber) { // Return true if rock overlaps with chamber or another rock
  let rockWidth = rock[0].length;

  if (
    rockY + rock.length > chamber.length ||
    rockX + rockWidth > chamber[0].length ||
    rockX < 0
  ) {
    return true; // Collides with chamber
  }

  let slice = chamber.slice(rockY, rockY + rock.length); // Rows of chamber to be changed
  return slice.some((row, y) => row.some((e, x) => {
    if (x < rockX || x >= rockX + rockWidth) return false;

    return (e === 1 && rock[y][x - rockX] === 1);
  }));

}

function addRock(rock, rockX, rockY, chamber) { // Add rock to chamber
  const rockWidth = rock[0].length;
  let slice = chamber.slice(rockY, rockY + rock.length); // Rows of chamber to be changed

  slice = slice.map((row, y) => row.map((cell, x) => { // Update slice with rock
    if (x < rockX || x >= rockX + rockWidth) return cell; // Cell is to the left or right of rock
    // if (cell === 1 && rock[y][x - rockX] === 1) console.log('ERROR - OVERLAPPING ROCKS'); // Trying to add a rock to existing rock

    return rock[y][x - rockX] > 0 ? 1 : cell;
  }))

  chamber.splice(rockY, rock.length, ...slice); // Add updated slice back to chamber
}

function processPatternData(data) {
  const beforePattern = data[0]; // First section is unique, others repeat
  const patternDef = data[1]; // First and last sections are unique, sections within are repeating

  const rocksBeforePattern = beforePattern.rockCount;

  const repeatIndex = data.findIndex((e, i) => i !== 1 && e.height === patternDef.height); // First repitition of second element
  const repeatingGroup = data.slice(1, repeatIndex); // Data that repeats
  const repeatingHeight = repeatingGroup.reduce((total, { height }) => total + height, 0); // Total height of group
  const rocksInEachGroup = repeatingGroup[repeatingGroup.length - 1].rockCount - rocksBeforePattern; // Total rocks use in group

  const initialDirectionIndex = beforePattern.dirIndex + 1;
  const initialRockIndex = beforePattern.rockIndex + 1;

  const totalRocks = 1000000000000;

  const numberOfRepeats = Math.floor((totalRocks - rocksBeforePattern) / rocksInEachGroup); // Groups needed to approch 1 trillions
  const rocksAfterPattern = (totalRocks - rocksBeforePattern) - (numberOfRepeats * rocksInEachGroup);
  // const rocksInFinalGroup = totalRocks - (amountOfGroups * rocksInEachGroup); // How many rocks to add to get to 1 trillion after groups

  // console.log(data);
  // console.log(rocksAfterRepeating);

  const topSectionData = simulateRocks(rocksAfterPattern, initialDirectionIndex, initialRockIndex);

  const heightBeforePattern = beforePattern.height;
  const heightOfPattern = numberOfRepeats * repeatingHeight;
  const heightAfterPattern = topSectionData.finalGroupHeight + topSectionData.storedChamberHeight;

  const totalHeight = heightBeforePattern + heightOfPattern + heightAfterPattern;
  console.log(rocksBeforePattern + rocksAfterPattern + (rocksInEachGroup * numberOfRepeats))
  console.log('DATA', data);
  console.log('PATTERN', repeatingGroup);
  console.log('BEGINNING ROCK INDEX', initialRockIndex);
  console.log('BEGINNING DIR INDEX', initialDirectionIndex);
  console.log('REPEATING HEIGHT', repeatingHeight);

  // < 1591977077362
  // > 1591977077302
  // > 1591977077342 Part 2 -- Cant get this to console log, IT WAS A GUESS LOLL
}