import { internals } from './board';
import { JEWEL_COUNT } from './jewels';
import { compose, extractPropFromObjectMatrix } from '../utils/utils';

describe('generateJewelIndex()', () => {
    it('returns jewel index value from 0 to JEWEL_COUNT', () => {
        [...Array(5)].forEach(() => {
            const jewelIndex = internals.generateJewelIndex();
            expect(jewelIndex).toBeGreaterThanOrEqual(0);
            expect(jewelIndex).toBeLessThanOrEqual(JEWEL_COUNT - 1);
        });
    });
});

describe('createMatrix()', () => {
    it('creates two dimensional array', () => {
        const x1 = 2;
        const y1 = 3;
        const matrix1 = internals.createMatrix(x1, y1);
        expect(matrix1).toHaveLength(y1);
        matrix1.forEach(row => {
            expect(row).toHaveLength(x1);
        });
    });
});

describe('makeBoardField()', () => {
    it('makes one boardField object with default values', () => {
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
    it('makes one boardField object with provided values', () => {
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
    it('makes complete game board (linked matrix)', () => {
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
        expect(upJewelMatrix).toEqual([
            jewelsMatrix[1],
            jewelsMatrix[2],
            jewelsMatrix[3],
            [null, null, null, null]
        ]);
        expect(downJewelMatrix).toEqual([
            [null, null, null, null],
            jewelsMatrix[0],
            jewelsMatrix[1],
            jewelsMatrix[2]
        ]);
        expect(leftJewelMatrix).toEqual([
            [null, ...jewelsMatrix[0]].slice(0, 4),
            [null, ...jewelsMatrix[1]].slice(0, 4),
            [null, ...jewelsMatrix[2]].slice(0, 4),
            [null, ...jewelsMatrix[3]].slice(0, 4)
        ]);
        expect(rightJewelMatrix).toEqual([
            [...jewelsMatrix[0], null].slice(1),
            [...jewelsMatrix[1], null].slice(1),
            [...jewelsMatrix[2], null].slice(1),
            [...jewelsMatrix[3], null].slice(1)
        ]);
    });
});

describe('mutateShiftNullOf()', () => {
    it('shifts null jewelIndex fields at the top', () => {
        const stubField = (jewelIndex = null) => ({ jewelIndex });
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
    it('fills null fields with values generated by provided generator function', () => {
        const stubField = (jewelIndex = null) => ({ jewelIndex });
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
        internals.mutateFillNullOf(generatorFn)(stubMatrix).mutate();
        expect(stubMatrix).toMatchObject(expectedResultMatrix);
    });
});
