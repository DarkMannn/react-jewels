export const throwMissingParam = paramName => {
    throw Error(`Missing param: ${paramName}`)
};

export const extractPropFromObjectMatrix = prop =>
    matrix =>
        matrix.map(column =>
            column.map(row => row && row[prop])
        );

export const compose2 = (fn1, fn2) => arg => fn1(fn2(arg));
export const compose = (...fns) => fns.reduce(compose2);
