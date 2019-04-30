import makeBoard from './board.js';

const makeGetRandomIntInclusive = (min, max) =>
    () => {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    };

const getRandomIntInclusive = makeGetRandomIntInclusive(0, 7);

const generateStartBoard = () => makeBoard().map(row => row.map(getRandomIntInclusive));
