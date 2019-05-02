import {
    throwMissingParam,
    extractPropFromObjectMatrix,
    compose2,
    compose,
} from './utils';

describe('throwMissingParam()', () => {
    it('throws error when the required param is missing', () => {
        const fn = (x = throwMissingParam('x')) => 'Not gonna get called';
        const wrappedFn = () => fn();
        expect(wrappedFn).toThrow(Error('Missing param: x'));
    });
});

describe('extractPropFromObjectMatrix', () => {
    it('makes matrix of primitive values', () => {
        const objectMatrix = [
            [{ prop: 1 }, { prop: 2 }],
            [{ prop: 3 }, { prop: 4 }]
        ];
        const primitiveMatrix = extractPropFromObjectMatrix('prop')(objectMatrix);
        expect(primitiveMatrix).toEqual([[1,2],[3,4]]);
    });
});

describe('compose2()', () => {
    it('composes two functions successfully', () => {
        const fn1 = () => 5;
        const fn2 = arg => arg;
        const composed = compose2(fn2, fn1);
        const result = composed();
        expect(result).toBe(5);
    });
});

describe('compose()', () => {
    it('composes multiple functions successfully', () => {
        const fn1 = () => 5;
        const fn2 = arg => arg + 1;
        const fn3 = arg => arg * 2;
        const composed = compose(fn3, fn2, fn1);
        const result = composed();
        expect(result).toBe(12);
    });
});
