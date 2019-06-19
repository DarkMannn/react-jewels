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

const traverseRightAndFindCombos = getCombosInLinkedList('right');
const traverseUpAndFindCombos = getCombosInLinkedList('up');

export const traverseAndFindCombos = board => {

    const comboMap = { x: [], y: [] };

    const zeroRow = board.map(column => column[0]);
    comboMap.x = zeroRow.map(traverseUpAndFindCombos);

    const zeroColumn = board[0];
    comboMap.y = zeroColumn.map(traverseRightAndFindCombos);

    return comboMap;
};

export const traverseAndFindCombo = field => {

    const partialComboMap = { x: [], y: [] };

    const travelLeft = (field) => field.left ? travelLeft(field.left) : field;
    const farLeftField = travelLeft(field);
    partialComboMap.y[field.y] = traverseRightAndFindCombos(farLeftField);

    const travelDown = (field) => field.down ? travelDown(field.down) : field;
    const bottomField = travelDown(field);
    partialComboMap.x[field.x] = traverseUpAndFindCombos(bottomField);

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

export const getPotentialCombosInLinkedList = direction =>
    startField => {

        const oppositeDirection = { right: 'left', up: 'down' }[direction];
        const orthogonalDirections = { right: ['up', 'down'], up: ['left', 'right']}[direction];
        const potentialCombos = [];

        if (
            startField[direction] && startField[direction][direction]
            && startField[direction].jewelIndex === startField[direction][direction].jewelIndex
        ) {
            const potentialComboJewel = startField[direction].jewelIndex;
            orthogonalDirections.forEach(orthDir => {
                if (startField[orthDir] && startField[orthDir].jewelIndex === potentialComboJewel) {
                    potentialCombos.push({ x2: startField[orthDir].x, y2: startField[orthDir].y });
                }
            });
            if (startField[oppositeDirection] && startField[oppositeDirection].jewelIndex === potentialComboJewel) {
                potentialCombos.push({ x2: startField[oppositeDirection].x, y2: startField[oppositeDirection].y });
            }
        }

        if (
            startField[oppositeDirection] && startField[direction]
            && startField[oppositeDirection].jewelIndex === startField[direction].jewelIndex
        ) {
            const potentialComboJewel = startField[direction].jewelIndex;
            orthogonalDirections.forEach(orthDir => {
                if (startField[orthDir] && startField[orthDir].jewelIndex === potentialComboJewel) {
                    potentialCombos.push({ x2: startField[orthDir].x, y2: startField[orthDir].y });
                }
            });
        }

        if (
            startField[oppositeDirection] && startField[oppositeDirection][oppositeDirection]
            && startField[oppositeDirection].jewelIndex === startField[oppositeDirection][oppositeDirection].jewelIndex
        ) {
            const potentialComboJewel = startField[oppositeDirection].jewelIndex;
            orthogonalDirections.forEach(orthDir => {
                if (startField[orthDir] && startField[orthDir].jewelIndex === potentialComboJewel) {
                    potentialCombos.push({ x2: startField[orthDir].x, y2: startField[orthDir].y });
                }
            });
            if (startField[direction] && startField[direction].jewelIndex === potentialComboJewel) {
                potentialCombos.push({ x2: startField[direction].x, y2: startField[direction].y });
            }
        }

        return potentialCombos.map(endField => ({ x1: startField.x, y1: startField.y, ...endField }));
    };

const traverseRightAndFindPotentialCombos = getPotentialCombosInLinkedList('right');
const traverseUpAndFindPotentialCombos = getPotentialCombosInLinkedList('up');

export const traverseAndFindPotentialCombos = board => {

    const potentialCombosNested = board.map((xArray, x) =>
        xArray.map((yField, y) =>
            [...traverseUpAndFindPotentialCombos(yField), ...traverseRightAndFindPotentialCombos(yField)]
        )
    );
    return potentialCombosNested
        .reduce((flatArr, potentialComboArr) => [...flatArr, ...potentialComboArr], [])
        .filter(fieldPotentialCombos => fieldPotentialCombos.length);
};

export const internals = {
    generateJewelIndex,
    makeBoardField,
    makeBoard,
    createNullifiedCombosMatrix,
    createNullShiftedMatrix,
    createNullFilledMatrix,
    createTwoFieldSwappedMatrix,
    getCombosInLinkedList,
    traverseRightAndFindCombos,
    traverseUpAndFindCombos,
    traverseAndFindCombos,
    traverseAndFindCombo,
    generateComboMatrixFromCombos,
    getPotentialCombosInLinkedList,
    traverseAndFindPotentialCombos
};
