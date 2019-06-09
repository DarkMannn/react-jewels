export const throwMissingParam = paramName => {
    throw Error(`Missing param: ${paramName}`)
};

export const createMatrix = (xLength, yLength) => [...Array(xLength)].map(() => [...Array(yLength)]);

export const makeGenerateRandomIntInclusive = (min, max) =>
    () => {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    };

export const extractPropFromObjectMatrix = prop =>
    matrix =>
        matrix.map(column =>
            column.map(row => row && row[prop])
        );

export const mutatePropsInObjectMatrix = prop =>
    matrix =>
        propMatrix => ({
            mutate: () => matrix.forEach((column, colIndex) =>
                column.forEach((row, rowIndex) => {
                    matrix[colIndex][rowIndex][prop] = propMatrix[colIndex][rowIndex];
                })
            )
        });

export const compose2 = (fn1, fn2) => arg => fn1(fn2(arg));
export const compose = (...fns) => fns.reduce(compose2);
export const repeat = times => fn => [...Array(times).keys()].map(num => fn(num));
