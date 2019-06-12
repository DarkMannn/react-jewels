import { JEWEL_COUNT } from './jewels';
import {
    throwMissingParam,
    extractPropFromObjectMatrix,
    createMatrix,
    makeGenerateRandomIntInclusive,
    mutatePropsInObjectMatrix,
} from '../utils/utils';

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;
const extractJewelIndexFrom = extractPropFromObjectMatrix('jewelIndex');
const mutateJewelIndexOf = mutatePropsInObjectMatrix('jewelIndex');
const generateJewelIndex = makeGenerateRandomIntInclusive(0, JEWEL_COUNT - 1);

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

export const mutateCombosToNullOf = matrix =>
    comboMatrix => ({
        mutate: () => {
            const jewelIndexMatrix = extractJewelIndexFrom(matrix);
            const nullifiedJewelIndexMatrix = jewelIndexMatrix.map((column, columnIndex) =>
                column.map((row, rowIndex) =>
                    comboMatrix[columnIndex]
                        ? !comboMatrix[columnIndex][rowIndex] ? row : null
                        : jewelIndexMatrix[columnIndex][rowIndex]
                )
            );
            mutateJewelIndexOf(matrix)(nullifiedJewelIndexMatrix).mutate();
        }
});

export const mutateShiftNullOf = matrix => ({
    mutate: () => {
        const jewelIndexMatrix = extractJewelIndexFrom(matrix);
        const shiftedJewelIndexMatrix = jewelIndexMatrix.map(xArray =>
            [...xArray].sort((a, b) => a === null ? 1 : (b === null ? -1 : 0))
        );
        mutateJewelIndexOf(matrix)(shiftedJewelIndexMatrix).mutate();
    }
});

export const mutateFillNullOf = matrix =>
    fillFn => ({
        mutate: () => {
            const jewelIndexMatrix = extractJewelIndexFrom(matrix);
            const filledJewelIndexMatrix = jewelIndexMatrix.map(xArray =>
                xArray.map(yField => yField !== null ? yField : fillFn())
            );
            mutateJewelIndexOf(matrix)(filledJewelIndexMatrix).mutate();
        }
    });

export const mutateSwapJewelIndexesFromTo = fromField =>
    toField => ({
        mutate: () => {
            [fromField.jewelIndex, toField.jewelIndex] = [toField.jewelIndex, fromField.jewelIndex];
        }
    });

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
    mutateCombosToNullOf,
    mutateShiftNullOf,
    mutateFillNullOf,
    mutateSwapJewelIndexesFromTo,
    getCombosInLinkedList,
    traverseRightAndGetCombos,
    traverseUpAndGetCombos,
    traverseAndFindCombos,
    traverseAndFindCombo,
    generateComboMatrixFromCombos,
};
