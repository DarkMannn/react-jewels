import { JEWEL_COUNT } from './jewels';
import {
    throwMissingParam,
    createMatrix,
    makeGenerateRandomIntInclusive,
    mutatePropsInObjectMatrix,
    extractPropFromObjectMatrix
} from '../utils/utils';

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

export const extractJewelIndexFrom = extractPropFromObjectMatrix('jewelIndex');
export const generateJewelIndex = makeGenerateRandomIntInclusive(0, JEWEL_COUNT - 1);
export const mutateJewelIndexOf = mutatePropsInObjectMatrix('jewelIndex');

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

export const makeBoard = (xLength = BOARD_WIDTH, yLength = BOARD_HEIGHT) => {

    const matrix = createMatrix(xLength, yLength);

    matrix.forEach((xArray, x) =>
        xArray.forEach((yField, y) => {

            const currentField = matrix[x][y] = makeBoardField({
                x: x,
                y: y,
                left: x === 0 ? null : matrix[x - 1][y],
                down: y === 0 ? null : matrix[x][y - 1]
            });

            if (currentField.down) currentField.down.up = currentField;
            if (currentField.left) currentField.left.right = currentField;
        })
    );

    return matrix;
};

export const createNullifiedCombosMatrix = comboMatrix => matrix => {

    const nullifiedCombosMatrix = matrix.map((column, columnIndex) =>
        column.map((row, rowIndex) =>
            comboMatrix[columnIndex]
                ? !comboMatrix[columnIndex][rowIndex] ? row : null
                : matrix[columnIndex][rowIndex]
        )
    );

    return nullifiedCombosMatrix;
};

export const createNullShiftedMatrix = matrix => matrix.map(xArray =>
    [...xArray].sort((a, b) => a === null ? 1 : (b === null ? -1 : 0))
);

export const createNullFilledMatrix = fillFn => matrix => matrix.map(xArray =>
        xArray.map(yField => yField !== null ? yField : fillFn())
);

export const createTwoFieldSwappedMatrix = ({ x: x1, y: y1 }) => ({ x: x2, y: y2 }) => matrix => {

    const newMatrix = JSON.parse(JSON.stringify(matrix));
    [newMatrix[x1][y1], newMatrix[x2][y2]] = [newMatrix[x2][y2], newMatrix[x1][y1]];

    return newMatrix;
}

/* eslint-disable no-cond-assign */
const getCombosInLinkedList = directionLink =>
    startField => {

        const coordinate = { right: 'x', up: 'y' }[directionLink];
        let currentField = startField;
        let latestCombo = [];
        let sumOfCombos = [];

        do {
            if (latestCombo.length && currentField.jewelIndex !== latestCombo[latestCombo.length - 1].jewelIndex) {
                if (latestCombo.length >= 3) sumOfCombos.push(...latestCombo.map(field => field[coordinate]));
                latestCombo = [];
            }
            latestCombo.push(currentField);
        } while (currentField = currentField[directionLink]);
        if (latestCombo.length >= 3) sumOfCombos.push(...latestCombo.map(field => field[coordinate]));

        return sumOfCombos;
    };

const traverseRightAndGetCombos = getCombosInLinkedList('right');
const traverseUpAndGetCombos = getCombosInLinkedList('up');

export const traverseAndFindCombos = matrix => {

    const comboMap = { x: [], y: [] };

    const zeroRow = matrix.map(column => column[0]);
    comboMap.x = zeroRow.map(traverseUpAndGetCombos);

    const zeroColumn = matrix[0];
    comboMap.y = zeroColumn.map(traverseRightAndGetCombos);

    return comboMap;
};

export const traverseAndFindCombo = field => {

    const partialComboMap = { x: [], y: [] };

    const travelLeft = (field) => field.left ? travelLeft(field.left) : field;
    const farLeftField = travelLeft(field);
    partialComboMap.y[field.y] = traverseRightAndGetCombos(farLeftField);

    const travelDown = (field) => field.down ? travelDown(field.down) : field;
    const bottomField = travelDown(field);
    partialComboMap.x[field.x] = traverseUpAndGetCombos(bottomField);

    return partialComboMap;
};

export const generateComboMatrixFromCombos = comboMap => {
    const comboMatrix = createMatrix(comboMap.x.length, comboMap.y.length);

    comboMap.x.forEach((column, columnIndex) =>
        column.forEach(rowIndex => comboMatrix[columnIndex][rowIndex] = true)
    );
    comboMap.y.forEach((row, rowIndex) =>
        row.forEach(columnIndex => comboMatrix[columnIndex][rowIndex] = true)
    );

    return comboMatrix;
}

export const internals = {
    generateJewelIndex,
    makeBoardField,
    makeBoard,
    createNullifiedCombosMatrix,
    createNullShiftedMatrix,
    createNullFilledMatrix,
    createTwoFieldSwappedMatrix,
    getCombosInLinkedList,
    traverseRightAndGetCombos,
    traverseUpAndGetCombos,
    traverseAndFindCombos,
    traverseAndFindCombo,
    generateComboMatrixFromCombos,
};
