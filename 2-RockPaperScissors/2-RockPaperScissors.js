var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const input = require("./input.txt");

const themMoves = {
    A: 'Rock',
    B: 'Paper',
    C: 'Scissors'
}

// const myMoves = {
//     X: 'Rock',
//     Y: 'Paper',
//     Z: 'Scissors'
// }

const scoreValues = {
    X: 0, // 
    Y: 3,
    Z: 6
}

const shapeValues = {
    'Rock': 1,
    'Paper': 2,
    'Scissors': 3
}

const results = {
    LOSE: 'X',
    DRAW: 'Y',
    WIN: 'Z'
}

const getScore = (them, me) => {
    if (them === 'Rock') {
        switch (me) {
            case 'Rock': return scoreValues.DRAW;
            case 'Paper': return scoreValues.WIN;
            case 'Scissors': return scoreValues.LOSS;
            default: return NaN;
        }
    } else if (them === 'Paper') {
        switch (me) {
            case 'Rock': return scoreValues.LOSS;
            case 'Paper': return scoreValues.DRAW;
            case 'Scissors': return scoreValues.WIN;
            default: return NaN;
        }
    } else if (them === 'Scissors') {
        switch (me) {
            case 'Rock': return scoreValues.WIN;
            case 'Paper': return scoreValues.LOSS;
            case 'Scissors': return scoreValues.DRAW;
            default: return NaN;
        }
    } else return NaN;
}

const getShape = (them, result) => {
    console.log();
    if (result === results.LOSE) {
        switch (themMoves[them]) {
            case 'Rock': return 'Scissors';
            case 'Paper': return 'Rock';
            case 'Scissors': return 'Paper';
            default: return NaN;
        }
    } else if (result === results.DRAW) {
        return themMoves[them];
    } else if (result === results.WIN) {
        switch (themMoves[them]) {
            case 'Rock': return 'Paper';
            case 'Paper': return 'Scissors';
            case 'Scissors': return 'Rock';
            default: return NaN;
        }
    } else return NaN;
}

const moves = input.split('\n').map(e => e.split(' '));

// const scores = moves.map(([them, me]) => {
//     const themMove = themMoves[them];
//     const myMove = myMoves[me.trim()];

//     const myScore = getScore(themMove, myMove);
//     const myShapeValue = shapeValues[myMove];

//     return myScore + myShapeValue;
// });

// console.log(scores.reduce((total, num) => total + num, 0)); // Part 1

const scores = moves.map(([them, result]) => {
    const myShape = getShape(them, result.trim());

    const gameScore = scoreValues[result.trim()];
    const myScore = shapeValues[myShape];

    return gameScore + myScore;
})

console.log(scores.reduce((total, num) => total + num, 0));