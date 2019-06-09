import {
    throwMissingParam,
    createMatrix,
    extractPropFromObjectMatrix,
    compose2,
    compose,
    repeat,
    mutatePropsInObjectMatrix,
    makeGenerateRandomIntInclusive,
} from './utils';

describe('throwMissingParam()', () => {
    it('throws error when the required param is missing', async () => {
        const fn = (x = throwMissingParam('x')) => 'Not gonna get called';
        const wrappedFn = () => fn();
        expect(wrappedFn).toThrow(Error('Missing param: x'));
    });
});

describe('createMatrix()', () => {
    it('creates two dimensional array', async () => {
        const x1 = 2;
        const y1 = 3;
        const matrix1 = createMatrix(x1, y1);
        expect(matrix1).toHaveLength(x1);
        matrix1.forEach(row => {
            expect(row).toHaveLength(y1);
        });
    });
});

describe('makeGenerateRandomIntInclusive()', () => {
    it('makes random int generator that generates inclusive integers', async () => {
        const generateFromOneToTen = makeGenerateRandomIntInclusive(1, 10);
        let timesToTest = 10;
        while (--timesToTest) {
            const generatedInt = generateFromOneToTen();
            expect(generatedInt).toBeGreaterThanOrEqual(1);
            expect(generatedInt).toBeLessThanOrEqual(10);
        }
    });
});

describe('extractPropFromObjectMatrix', () => {
    it('makes matrix of primitive values', async () => {
        const objectMatrix = [
            [{ prop: 1 }, { prop: 2 }],
            [{ prop: 3 }, { prop: 4 }]
        ];
        const primitiveMatrix = extractPropFromObjectMatrix('prop')(objectMatrix);
        expect(primitiveMatrix).toEqual([[1,2],[3,4]]);
    });
});

describe('mutatePropsInObjectMatrix()', () => {
    it('mutates props of all objects in an matrix of objects', async () => {
        const objectMatrix = [
            [{ prop: 1 }, { prop: 2 }],
            [{ prop: 3 }, { prop: 4 }]
        ];
        const propMatrix = [
            [4, 3],
            [2, 1]
        ];
        mutatePropsInObjectMatrix('prop')(objectMatrix)(propMatrix).mutate();
        expect(objectMatrix).toEqual([
            [{ prop: 4 }, { prop: 3 }],
            [{ prop: 2 }, { prop: 1 }]
        ]);
    });
});

describe('compose2()', () => {
    it('composes two functions successfully', async () => {
        const fn1 = () => 5;
        const fn2 = arg => arg;
        const composed = compose2(fn2, fn1);
        const result = composed();
        expect(result).toBe(5);
    });
});

describe('compose()', () => {
    it('composes multiple functions successfully', async () => {
        const fn1 = () => 5;
        const fn2 = arg => arg + 1;
        const fn3 = arg => arg * 2;
        const composed = compose(fn3, fn2, fn1);
        const result = composed();
        expect(result).toBe(12);
    });
});

describe('repeat()', () => {
    it('repeats a function multiple times passing number of iteration from 0', async () => {
        const double = num => num * 2;
        const results = repeat(5)(double);
        expect(results).toEqual([0, 2, 4, 6, 8]);
    });
});
