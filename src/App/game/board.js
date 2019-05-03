import { JEWEL_COUNT } from './jewels';
import {
    throwMissingParam,
    extractPropFromObjectMatrix,
    mutatePropsInObjectMatrix,
} from '../utils/utils';

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;
const extractJewelIndexFrom = extractPropFromObjectMatrix('jewelIndex');
const mutateJewelIndexOf = mutatePropsInObjectMatrix('jewelIndex');

const makeGenerateRandomIntInclusive = (min, max) =>
    () => {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    };
const generateJewelIndex = makeGenerateRandomIntInclusive(0, JEWEL_COUNT - 1);

const createMatrix = (colLength, rowLength) => [...Array(rowLength)].map(() => [...Array(colLength)]);

const makeBoardField = ({
    jewelIndex = generateJewelIndex(),
    x = throwMissingParam('x'),
    y = throwMissingParam('y'),
    up = null,
    down = null,
    left = null,
    right = null
}) => Object.seal({
    jewelIndex, x, y, up, down, left, right
});

const makeBoard = (colLength = BOARD_HEIGHT, rowLength = BOARD_WIDTH) => {

    const matrix = createMatrix(colLength, rowLength);

    matrix.forEach((column, colIndex) =>
        column.forEach((row, rowIndex) => {

            const currentField = matrix[colIndex][rowIndex] = makeBoardField({
                x: colIndex,
                y: rowIndex,
                down: colIndex === 0 ? null : matrix[colIndex - 1][rowIndex],
                left: rowIndex === 0 ? null : matrix[colIndex][rowIndex - 1]
            });

            if (currentField.down) currentField.down.up = currentField;
            if (currentField.left) currentField.left.right = currentField;
        })
    );

    return matrix;
};

const mutateShiftNullOf = matrix => ({
    mutate: () => {
        const jewelIndexMatrix = extractJewelIndexFrom(matrix);
        const shiftedJewelIndexMatrix = jewelIndexMatrix.map(column =>
            [...column].sort((a, b) => a === null ? 1 : (b === null ? -1 : 0))
        );
        mutateJewelIndexOf(matrix)(shiftedJewelIndexMatrix).mutate();
    }
});

const mutateFillNullOf = generatorFn =>
    matrix => ({
        mutate: () => {
            const jewelIndexMatrix = extractJewelIndexFrom(matrix);
            const filledJewelIndexMatrix = jewelIndexMatrix.map(column =>
                column.map(rowItem => rowItem !== null ? rowItem : generatorFn())
            );
            mutateJewelIndexOf(matrix)(filledJewelIndexMatrix).mutate();
        }
    });

export const internals = {
    generateJewelIndex,
    createMatrix,
    makeBoardField,
    makeBoard,
    mutateShiftNullOf,
    mutateFillNullOf,
};
