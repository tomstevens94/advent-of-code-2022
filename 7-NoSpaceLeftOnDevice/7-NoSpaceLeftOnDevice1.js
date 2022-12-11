var fs = require('fs');
const util = require('util');
const { isNumberObject } = require('util/types');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

let lines = input.split('\n')
let dirTree = {};
let currentPath = '';

function downOneLevel(str) {
  if (currentPath) {
    const splitPath = currentPath.split('.');
    currentPath = [...splitPath, str].join('.')
  } else {
    currentPath = str;
  }

  // console.log('INCREASED PATH', currentPath);
}

function upOneLevel() {
  const splitPath = currentPath.split('.');

  currentPath = splitPath.slice(0, -1).join('.');
  // console.log('DECREASED PATH', currentPath);
}

let reading = true;
let currentLine = 0;
let count = 0;

let test = {
  testt: {
    testtt: {
      key: 10
    }
  }
}

function log(val) {
  console.log(util.inspect(val, { showHidden: false, depth: null, colors: true })); // Directory tree created
}

const path = 'testt.testtt.key';

function assignNestedValue(obj, path, value) { // Used to change values of nested objects
  path = path[0] === '.' ? path.slice(1, path.length) : path;
  // console.log('PATH', path);
  let splitFullPath = path.split('.');

  const splitPath = splitFullPath.slice(0, -1);
  const dest = splitFullPath[splitFullPath.length - 1];

  const finalDir = splitPath.reduce((nested, key) => {
    return nested[key];
  }, obj);

  finalDir[dest] = value;
}

// assignNestedValue(test, path, 20);
let directoryPaths = [];

while (currentLine < lines.length) {
  let jumpToLine = undefined;

  const line = lines[currentLine];

  if (line[0] === '$') { // Console user input
    const command = line.replace('$ ', '');
    if (command.slice(0, 2) === 'cd') { // Change directory
      if (command === 'cd /') { // Initial entry of main directory

      } else if (command === 'cd ..') {
        upOneLevel();
      } else {
        const subDir = command.replace('cd ', '');
        downOneLevel(subDir);
      }
    } else if (command.slice(0, 2) === 'ls') { // List contents
      jumpToLine = lines.findIndex((e, i) => i > currentLine && e[0] === '$');

      const listedInfo = lines.slice(currentLine + 1, jumpToLine);
      const dirKeys = listedInfo.filter(e => e.slice(0, 3) === 'dir').map(e => e.slice(4));
      dirKeys.forEach(key => {
        assignNestedValue(dirTree, currentPath.length > 0 ? `${currentPath}.${key}` : key, {});
        directoryPaths.push(currentPath ? `${currentPath}.${key}` : key);
      });

      const files = listedInfo.filter(e => e.slice(0, 3) !== 'dir').map(e => e.split(' ')[0]);

      if (files.length > 0) {
        assignNestedValue(dirTree, `${currentPath}.${'files'}`, files);
      }
    }
  }

  currentLine = jumpToLine !== -1 && jumpToLine ? jumpToLine : currentLine + 1;
}

// log(dirTree);

directoryPaths = directoryPaths.sort((a, b) => b.split('.').length - a.split('.').length); // Sort by deepest nested directories first
// console.log(directoryPaths.length);

let directorySizes = {};
let allFiles = 0;

directoryPaths.forEach((path, i) => {
  const splitPath = path.split('.');

  const finalDir = splitPath.reduce((nested, key) => {
    return nested[key];
  }, dirTree);

  // if (directorySizes[path]) console.log(directorySizes[path]);
  let containedFiles = finalDir.files !== undefined ? finalDir.files.reduce((total, num) => total + Number(num), 0) : 0;
  allFiles += containedFiles;

  const dirKeys = Object.keys(finalDir).filter(e => e !== 'files');

  const containedDirs = dirKeys.map(key => directorySizes[`${path}.${key}`]).reduce((total, num) => total + num, 0);
  const totalSize = containedFiles + containedDirs

  directorySizes[path] = totalSize;

  // if (i > 178) {
  //   console.log(path, containedFiles, containedDirs, dirKeys);
  //   log(finalDir);
  //   console.log('----------------------------------')
  // }
});

// const maxSize = 100000;
// const smallDirectories = Object.values(directorySizes).filter(e => Number(e) < maxSize);
// console.log(smallDirectories, smallDirectories.reduce((total, num) => total + num, 0)); // Part 1

const totalSpace = 70000000;
const spaceRequired = 30000000;

const spaceUsed = lines.filter(e => Number(e.split(' ')[0])).map(e => Number(e.split(' ')[0])).reduce((total, num) => total + num, 0);

const currentSpace = totalSpace - spaceUsed;
const deletionNeeded = spaceRequired - currentSpace;

console.log('TOTAL', totalSpace);
console.log('REQUIRED FOR UPDATE', spaceRequired);
console.log('CURRENTLY USED', spaceUsed);
console.log('CURRENT SPACE', currentSpace);
console.log('DELETION REQUIRED', deletionNeeded);

console.log('DIRECTORY SIZE TO DELETE', Object.values(directorySizes).sort((a, b) => a - b).find(e => e >= deletionNeeded)); // Part 2