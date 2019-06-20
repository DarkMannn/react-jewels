import { css } from 'styled-components';
import 'styled-components/macro';

export const throwMissingParam = paramName => {
    throw Error(`Missing param: ${paramName}`)
};

export const createMatrix = (xLength, yLength) => [...Array(xLength)].map(() => [...Array(yLength)]);

export const makeGenerateRandomIntInclusive = (min, max) =>
    () => {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    };

export const extractPropFromObjectMatrix = prop =>
    matrix =>
        matrix.map(column =>
            column.map(row => row && row[prop])
        );

export const mutatePropsInObjectMatrix = prop =>
    matrix =>
        propMatrix => ({
            mutate: () => matrix.forEach((column, colIndex) =>
                column.forEach((row, rowIndex) => {
                    matrix[colIndex][rowIndex][prop] = propMatrix[colIndex][rowIndex];
                })
            )
        });

export const compose2 = (fn1, fn2) => arg => fn1(fn2(arg));
export const compose = (...fns) => fns.reduce(compose2);
export const repeat = times => fn => [...Array(times).keys()].map(num => fn(num));

const displayWidths = [0, 600, 800, 1000, 1200, 10000];
export const media = {};
displayWidths.forEach((width, index, array) => {

    if (index === array.length - 1) return;
    media[`min${width}max${array[index + 1]}`] = (...args) => css`
        @media screen
        and (min-width: ${width}px)
        and (max-width: ${array[index + 1]}px) {
            ${css(...args)}
        }
    `;
});

export const wait = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const areItemsAdjacent = (firstItem, secondItem) =>
    (firstItem.x === secondItem.x && Math.abs(firstItem.y - secondItem.y) === 1) ||
    (firstItem.y === secondItem.y && Math.abs(firstItem.x - secondItem.x) === 1);

export const doItemsMatch = (firstItem, secondItem) =>
    firstItem && secondItem && firstItem.x === secondItem.x && firstItem.y === secondItem.y;
