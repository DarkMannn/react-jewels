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

describe('mutateCombosToNullOf()', () => {
    it('mutates combos to null values reading boolean combo map', async () => {
        const stubMatrix = [
            [stubField(1), stubField(1), stubField(1), stubField(3)],
            [stubField(1), stubField(3), stubField(2), stubField(0)],
            [stubField(5), stubField(5), stubField(5), stubField(0)],
            [stubField(4), stubField(3), stubField(2), stubField(0)]
        ];
        const comboMatrix = [
            [true, true, true, undefined],
            [undefined, undefined, undefined, true],
            [true, true, true, true],
            [undefined, undefined, undefined, true]
        ];
        const expectedResultMatrix = [
            [stubField(), stubField(), stubField(), stubField(3)],
            [stubField(1), stubField(3), stubField(2), stubField()],
            [stubField(), stubField(), stubField(), stubField()],
            [stubField(4), stubField(3), stubField(2), stubField()]
        ];
        internals.mutateCombosToNullOf(stubMatrix)(comboMatrix).mutate();
        expect(stubMatrix).toMatchObject(expectedResultMatrix);
    });
    it('mutates partial combos to null values reading boolean partial  combo map', async () => {
        const stubMatrix = [
            [stubField(1), stubField(2), stubField(3), stubField(3)],
            [stubField(1), stubField(2), stubField(3), stubField(0)],
            [stubField(3), stubField(3), stubField(3), stubField(1)],
            [stubField(4), stubField(3), stubField(2), stubField(2)]
        ];
        const comboMatrix = [
            [undefined, undefined, true],
            [undefined, undefined, true],
            [true, true, true]
        ];
        const expectedResultMatrix = [
            [stubField(1), stubField(2), stubField(), stubField(3)],
            [stubField(1), stubField(2), stubField(), stubField(0)],
            [stubField(), stubField(), stubField(), stubField(1)],
            [stubField(4), stubField(3), stubField(2), stubField(2)]
        ];
        internals.mutateCombosToNullOf(stubMatrix)(comboMatrix).mutate()
        expect(stubMatrix).toMatchObject(expectedResultMatrix);
    });
});

describe('mutateShiftNullOf()', () => {
    it('shifts null jewelIndex fields at the top', async () => {
        const stubMatrix = [
            [stubField(1), stubField(), stubField(), stubField(3)],
            [stubField(1), stubField(3), stubField(2), stubField(0)],
            [stubField(), stubField(5), stubField(6), stubField(3)],
            [stubField(), stubField(), stubField(), stubField(4)]
        ];
        const expectedResultMatrix = [
            [stubField(1), stubField(3), stubField(), stubField()],
            [stubField(1), stubField(3), stubField(2), stubField(0)],
            [stubField(5), stubField(6), stubField(3), stubField()],
            [stubField(4), stubField(), stubField(), stubField()]
        ];
        internals.mutateShiftNullOf(stubMatrix).mutate();
        expect(stubMatrix).toMatchObject(expectedResultMatrix);
    });
});

describe('mutatefillNullOf()', () => {
    it('fills null fields with values generated by provided generator function', async () => {
        const generatorFn = () => 4;
        const stubMatrix = [
            [stubField(1), stubField(3), stubField(), stubField()],
            [stubField(1), stubField(3), stubField(2), stubField(0)],
            [stubField(5), stubField(6), stubField(3), stubField()],
            [stubField(4), stubField(), stubField(), stubField()]
        ];
        const expectedResultMatrix = [
            [stubField(1), stubField(3), stubField(4), stubField(4)],
            [stubField(1), stubField(3), stubField(2), stubField(0)],
            [stubField(5), stubField(6), stubField(3), stubField(4)],
            [stubField(4), stubField(4), stubField(4), stubField(4)]
        ];
        internals.mutateFillNullOf(stubMatrix)(generatorFn).mutate();
        expect(stubMatrix).toMatchObject(expectedResultMatrix);
    });
});

describe('mutateSwapJewelIndexesFromTo()', () => {
    it('swaps two jewelIndexes from given adjacent fields', () => {
        const stubMatrix = [
            [stubField(1), stubField(3), stubField(4), stubField(4)],
            [stubField(1), stubField(3), stubField(2), stubField(0)],
            [stubField(5), stubField(6), stubField(3), stubField(4)],
            [stubField(4), stubField(4), stubField(2), stubField(4)]
        ];
        const expectedResultMatrix = [
            [stubField(1), stubField(3), stubField(4), stubField(4)],
            [stubField(1), stubField(3), stubField(2), stubField(0)],
            [stubField(5), stubField(3), stubField(6), stubField(4)],
            [stubField(4), stubField(4), stubField(2), stubField(4)]
        ];
        internals.mutateSwapJewelIndexesFromTo(stubMatrix[2][1])(stubMatrix[2][2]).mutate();
        expect(stubMatrix).toMatchObject(expectedResultMatrix);
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
