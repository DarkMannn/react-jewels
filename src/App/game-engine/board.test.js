import { internals } from './board';
import { JEWEL_COUNT } from './jewels';
import {
    compose,
    extractPropFromObjectMatrix,
    mutatePropsInObjectMatrix
} from '../utils/utils';

const stubField = (jewelIndex = null) => ({ jewelIndex });

describe('generateJewelIndex()', () => {
    it('returns jewel index value from 0 to JEWEL_COUNT', async () => {
        [...Array(5)].forEach(() => {
            const jewelIndex = internals.generateJewelIndex();
            expect(jewelIndex).toBeGreaterThanOrEqual(0);
            expect(jewelIndex).toBeLessThanOrEqual(JEWEL_COUNT - 1);
        });
    });
});

describe('makeBoardField()', () => {
    it('makes one boardField object with default values', async () => {
        const boardField = internals.makeBoardField({
            jewelIndex: 1,
            x: 1,
            y: 1
        });
        expect(boardField).toMatchObject({
            jewelIndex: 1,
            x: 1,
            y: 1,
            up: null,
            down: null,
            left: null,
            right: null
        })
    });
    it('makes one boardField object with provided values', async () => {
        const boardField = internals.makeBoardField({
            jewelIndex: 1,
            x: 1,
            y: 1,
            up: {},
            down: {},
            left: {},
            right: {}
        });
        expect(boardField).toMatchObject({
            jewelIndex: 1,
            x: 1,
            y: 1,
            up: {},
            down: {},
            left: {},
            right: {}
        })
    });
});

describe('makeBoard()', () => {
    it('makes complete game board (linked matrix)', async () => {
        const gameBoard = internals.makeBoard(4, 4);
        const extractJewelIndex = extractPropFromObjectMatrix('jewelIndex');
        const jewelsMatrix = extractJewelIndex(gameBoard);
        const xMatrix = extractPropFromObjectMatrix('x')(gameBoard);
        const yMatrix = extractPropFromObjectMatrix('y')(gameBoard);
        const upJewelMatrix = compose(extractJewelIndex, extractPropFromObjectMatrix('up'))(gameBoard);
        const downJewelMatrix = compose(extractJewelIndex, extractPropFromObjectMatrix('down'))(gameBoard);
        const leftJewelMatrix = compose(extractJewelIndex, extractPropFromObjectMatrix('left'))(gameBoard);
        const rightJewelMatrix = compose(extractJewelIndex, extractPropFromObjectMatrix('right'))(gameBoard);

        expect(gameBoard).toHaveLength(4);
        expect(jewelsMatrix.some(column =>
            column.some(jewelIndex => jewelIndex === null)
        )).toBeFalsy();
        expect(xMatrix).toEqual([
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [2, 2, 2, 2],
            [3, 3, 3, 3],
        ]);
        expect(yMatrix).toEqual([
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
        ]);
        expect(rightJewelMatrix).toEqual([
            jewelsMatrix[1],
            jewelsMatrix[2],
            jewelsMatrix[3],
            [null, null, null, null]
        ]);
        expect(leftJewelMatrix).toEqual([
            [null, null, null, null],
            jewelsMatrix[0],
            jewelsMatrix[1],
            jewelsMatrix[2]
        ]);
        expect(downJewelMatrix).toEqual([
            [null, ...jewelsMatrix[0]].slice(0, 4),
            [null, ...jewelsMatrix[1]].slice(0, 4),
            [null, ...jewelsMatrix[2]].slice(0, 4),
            [null, ...jewelsMatrix[3]].slice(0, 4)
        ]);
        expect(upJewelMatrix).toEqual([
            [...jewelsMatrix[0], null].slice(1),
            [...jewelsMatrix[1], null].slice(1),
            [...jewelsMatrix[2], null].slice(1),
            [...jewelsMatrix[3], null].slice(1)
        ]);
    });
});

describe('createNullifiedCombosMatrix()', () => {
    it('created new matrix with combos to null values reading boolean combo map', async () => {
        const stubMatrix = [
            [1, 1, 1, 3],
            [1, 3, 2, 0],
            [5, 5, 5, 0],
            [4, 3, 2, 0]
        ];
        const comboMatrix = [
            [true, true, true, undefined],
            [undefined, undefined, undefined, true],
            [true, true, true, true],
            [undefined, undefined, undefined, true]
        ];
        const expectedResultMatrix = [
            [null, null, null, 3],
            [1, 3, 2, null],
            [null, null, null, null],
            [4, 3, 2, null]
        ];
        const nullifiedMatrix = internals.createNullifiedCombosMatrix(comboMatrix)(stubMatrix);
        expect(nullifiedMatrix).toMatchObject(expectedResultMatrix);
    });
    it('creates new matrix from partial combos to null values reading boolean partial  combo map', async () => {
        const stubMatrix = [
            [1, 2, 3, 3],
            [1, 2, 3, 0],
            [3, 3, 3, 1],
            [4, 3, 2, 2]
        ];
        const comboMatrix = [
            [undefined, undefined, true],
            [undefined, undefined, true],
            [true, true, true]
        ];
        const expectedResultMatrix = [
            [1, 2, null, 3],
            [1, 2, null, 0],
            [null, null, null, 1],
            [4, 3, 2, 2]
        ];
        const nullifiedMatrix = internals.createNullifiedCombosMatrix(comboMatrix)(stubMatrix);
        expect(nullifiedMatrix).toMatchObject(expectedResultMatrix);
    });
});

describe('createNullShiftedMatrix()', () => {
    it('creates matrix with shifted null jewelIndex fields at the top', async () => {
        const stubMatrix = [
            [1, null, null, 3],
            [1, 3, 2, 0],
            [null, 5, 6, 3],
            [null, null, null, 4]
        ];
        const expectedResultMatrix = [
            [1, 3, null, null],
            [1, 3, 2, 0],
            [5, 6, 3, null],
            [4, null, null, null]
        ];
        const shiftedNullMatrix = internals.createNullShiftedMatrix(stubMatrix);
        expect(shiftedNullMatrix).toMatchObject(expectedResultMatrix);
    });
});

describe('createNullFilledMatrix()', () => {
    it('creates matrix with filled null fields with values generated by provided generator function', async () => {
        const generatorFn = () => 4;
        const stubMatrix = [
            [1, 3, null, null],
            [1, 3, 2, 0],
            [5, 6, 3, null],
            [4, null, null, null]
        ];
        const expectedResultMatrix = [
            [1, 3, 4, 4],
            [1, 3, 2, 0],
            [5, 6, 3, 4],
            [4, 4, 4, 4]
        ];
        const filledNullMatrix = internals.createNullFilledMatrix(generatorFn)(stubMatrix);
        expect(filledNullMatrix).toMatchObject(expectedResultMatrix);
    });
});

describe('createTwoFieldSwappedMatrix()', () => {
    it('creates new matrix with swaped two jewelIndexes from given adjacent fields', () => {
        const stubMatrix = [
            [1, 3, 4, 4],
            [1, 3, 2, 0],
            [5, 6, 3, 4],
            [4, 4, 2, 4]
        ];
        const expectedResultMatrix = [
            [1, 3, 4, 4],
            [1, 3, 2, 0],
            [5, 3, 6, 4],
            [4, 4, 2, 4]
        ];
        const swappedMatrix = internals.createTwoFieldSwappedMatrix({ x1: 2, y1: 1})({ x2: 2, y2: 2})(stubMatrix);
        expect(swappedMatrix).toMatchObject(expectedResultMatrix);
    });
});

describe('traverseRightAndGetCombos(), traverseUpAndGetCombos()', () => {
    describe('traverses up and/or right and makes appropriate hash of combos, writting opposite coordinates', () => {
        it('board 4x4', async () => {
            const gameBoard4 = internals.makeBoard(4, 4);
            const stubJewels = [
                [1, 1, 1, 2],
                [2, 3, 4, 4],
                [5, 5, 5, 4],
                [5, 5, 2, 4]
            ];
            mutatePropsInObjectMatrix('jewelIndex')(gameBoard4)(stubJewels).mutate();

            const zeroRow = gameBoard4.map(column => column[0]);
            const comboMapX = zeroRow.map(internals.traverseUpAndGetCombos);
            expect(comboMapX).toEqual([
                [0, 1, 2],
                [],
                [0, 1, 2],
                []
            ]);

            const zeroColumn = gameBoard4[0];
            const comboMapY = zeroColumn.map(internals.traverseRightAndGetCombos);
            expect(comboMapY).toEqual([
                [],
                [],
                [],
                [1, 2, 3]
            ]);
        });
        it('board 8x8', async () => {
            const gameBoard8 = internals.makeBoard(8, 8);
            const stubJewels = [
                [1, 1, 1, 2, 2, 2, 2, 3],
                [2, 3, 4, 4, 2, 1, 2, 1],
                [5, 5, 5, 4, 2, 3, 3, 3],
                [0, 1, 1, 2, 2, 4, 5, 6],
                [0, 6, 0, 6, 0, 6, 0, 6],
                [0, 6, 0, 6, 0, 6, 0, 6],
                [5, 5, 2, 4, 0, 6, 0, 6],
                [5, 5, 2, 4, 0, 6, 0, 6],
            ];
            mutatePropsInObjectMatrix('jewelIndex')(gameBoard8)(stubJewels).mutate();

            const zeroRow = gameBoard8.map(column => column[0]);
            const comboMapX = zeroRow.map(internals.traverseUpAndGetCombos);
            expect(comboMapX).toEqual([
                [0, 1, 2, 3, 4, 5, 6],
                [],
                [0, 1, 2, 5, 6, 7],
                [],
                [],
                [],
                [],
                []
            ]);

            const zeroColumn = gameBoard8[0];
            const comboMapY = zeroColumn.map(internals.traverseRightAndGetCombos);
            expect(comboMapY).toEqual([
                [3, 4, 5],
                [],
                [],
                [],
                [0, 1, 2, 3, 4, 5, 6, 7],
                [4, 5, 6, 7],
                [4, 5, 6, 7],
                [3, 4, 5, 6, 7]
            ]);
        });
    });
});

describe('traverseAndFindCombos()', () => {
    it('traverses up and right and makes appropriate hash of combos, writting opposite coordinates', async () => {
        const gameBoard4 = internals.makeBoard(4, 4);
        const stubJewels = [
            [1, 1, 1, 2],
            [2, 3, 4, 4],
            [5, 5, 5, 4],
            [5, 5, 2, 4]
        ];
        mutatePropsInObjectMatrix('jewelIndex')(gameBoard4)(stubJewels).mutate();

        const comboMap = internals.traverseAndFindCombos(gameBoard4);
        expect(comboMap.x).toEqual([
            [0, 1, 2],
            [],
            [0, 1, 2],
            []
        ]);
        expect(comboMap.y).toEqual([
            [],
            [],
            [],
            [1, 2, 3]
        ]);
    });
});

describe('traverseAndFindCombos()', () => {
    it('traverses up and right and makes appropriate hash of combos, writting opposite coordinates', async () => {
        const gameBoard4 = internals.makeBoard(4, 4);
        const stubJewels = [
            [1, 1, 4, 2],
            [2, 3, 4, 4],
            [5, 5, 4, 2],
            [5, 5, 5, 4]
        ];
        mutatePropsInObjectMatrix('jewelIndex')(gameBoard4)(stubJewels).mutate();

        const field = gameBoard4[3][2];
        const partialComboMap = internals.traverseAndFindCombo(field);
        expect(partialComboMap.x).toEqual([
            undefined,
            undefined,
            undefined,
            [0, 1, 2]
        ]);
        expect(partialComboMap.y).toEqual([
            undefined,
            undefined,
            [0, 1, 2]
        ]);
    });
});

describe('generateComboMatrixFromCombos()', () => {
    it('generates matrix of "true" values where the combos are', async () => {
        const gameBoard4 = internals.makeBoard(4, 4);
        const stubJewels = [
            [1, 1, 1, 2],
            [2, 3, 4, 4],
            [5, 5, 5, 4],
            [5, 5, 2, 4]
        ];
        mutatePropsInObjectMatrix('jewelIndex')(gameBoard4)(stubJewels).mutate();

        const comboMap = internals.traverseAndFindCombos(gameBoard4);
        const comboMatrix = internals.generateComboMatrixFromCombos(comboMap);
        expect(comboMatrix).toEqual([
            [true, true, true, undefined],
            [undefined, undefined, undefined, true],
            [true, true, true, true],
            [undefined, undefined, undefined, true]
        ]);
    });
    it('generates matrix of "true" values from partialComboMap', async () => {
        const gameBoard4 = internals.makeBoard(4, 4);
        const stubJewels = [
            [1, 1, 4, 2],
            [2, 3, 4, 4],
            [5, 5, 4, 2],
            [5, 5, 5, 4]
        ];
        mutatePropsInObjectMatrix('jewelIndex')(gameBoard4)(stubJewels).mutate();

        const field = gameBoard4[3][2];
        const partialComboMap = internals.traverseAndFindCombo(field);

        const comboMatrix = internals.generateComboMatrixFromCombos(partialComboMap);
        expect(comboMatrix).toEqual([
            [undefined, undefined, true],
            [undefined, undefined, true],
            [undefined, undefined, true],
            [true, true, true]
        ]);
    });
});
