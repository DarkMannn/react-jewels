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

const createMatrix = (xLength, yLength) => [...Array(xLength)].map(() => [...Array(yLength)]);

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

const makeBoard = (xLength = BOARD_WIDTH, yLength = BOARD_HEIGHT) => {

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

const mutateCombosToNullOf = matrix =>
    comboMatrix => ({
        mutate: () => {
            const jewelIndexMatrix = extractJewelIndexFrom(matrix);
            const nullifiedJewelIndexMatrix = jewelIndexMatrix.map((column, columnIndex) =>
                column.map((row, rowIndex) =>
                    !comboMatrix[columnIndex][rowIndex] ? row : null
                )
            );
            mutateJewelIndexOf(matrix)(nullifiedJewelIndexMatrix).mutate();
        }
});

const mutateShiftNullOf = matrix => ({
    mutate: () => {
        const jewelIndexMatrix = extractJewelIndexFrom(matrix);
        const shiftedJewelIndexMatrix = jewelIndexMatrix.map(xArray =>
            [...xArray].sort((a, b) => a === null ? 1 : (b === null ? -1 : 0))
        );
        mutateJewelIndexOf(matrix)(shiftedJewelIndexMatrix).mutate();
    }
});

const mutateFillNullOf = fillFn =>
    matrix => ({
        mutate: () => {
            const jewelIndexMatrix = extractJewelIndexFrom(matrix);
            const filledJewelIndexMatrix = jewelIndexMatrix.map(xArray =>
                xArray.map(yField => yField !== null ? yField : fillFn())
            );
            mutateJewelIndexOf(matrix)(filledJewelIndexMatrix).mutate();
        }
    });

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

const traverseAndFindCombos = matrix => {

    const comboMap = { x: [], y: [] };

    const zeroRow = matrix.map(column => column[0]);
    comboMap.x = zeroRow.map(traverseUpAndGetCombos);

    const zeroColumn = matrix[0];
    comboMap.y = zeroColumn.map(traverseRightAndGetCombos);

    return comboMap;
};

const generateComboMatrixFromCombos = comboMap => {
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
    createMatrix,
    makeBoardField,
    makeBoard,
    mutateCombosToNullOf,
    mutateShiftNullOf,
    mutateFillNullOf,
    getCombosInLinkedList,
    traverseRightAndGetCombos,
    traverseUpAndGetCombos,
    traverseAndFindCombos,
    generateComboMatrixFromCombos,
};
