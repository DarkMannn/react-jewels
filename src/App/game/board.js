const createMatrix = (x, y) => [...Array(y)].map(() => Array(x).fill(null));
const makeBoard = () => createMatrix(8, 8);

export default makeBoard;
