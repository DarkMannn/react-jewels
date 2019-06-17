import {
    traverseAndFindCombos,
    generateComboMatrixFromCombos,
    createNullifiedCombosMatrix,
    createNullShiftedMatrix,
    createNullFilledMatrix,
    createTwoFieldSwappedMatrix,
    extractJewelIndexFrom,
    generateJewelIndex,
    mutateJewelIndexOf,
    makeBoard,
    BOARD_HEIGHT,
    BOARD_WIDTH
} from './board';
import { wait } from '../utils/utils.js';

const board = makeBoard();

export const initialMatrix = extractJewelIndexFrom(board);
export { createTwoFieldSwappedMatrix };
export { BOARD_HEIGHT };
export { BOARD_WIDTH };

export const updateBoard = async ({ newMatrix, setMatrix, setComboMatrix }) => {

    let moveHadHits = false;
    mutateJewelIndexOf(board)(newMatrix).mutate();

    await (async function updateUntilNoCombos() {

        const comboMap = traverseAndFindCombos(board);
        if (!comboMap.x.some(col => col.length) && !comboMap.y.some(row => row.length)) {
            return;
        }

        const currentMatrix = extractJewelIndexFrom(board);
        const comboMatrix = generateComboMatrixFromCombos(comboMap);
        const nullifiedMatrix = createNullifiedCombosMatrix(comboMatrix)(currentMatrix);
        setComboMatrix(nullifiedMatrix);
        await wait();

        setMatrix(nullifiedMatrix);
        await wait();

        const shiftedMatrix = createNullShiftedMatrix(nullifiedMatrix);
        setComboMatrix(shiftedMatrix);
        setMatrix(shiftedMatrix);
        await wait();

        const filledMatrix = createNullFilledMatrix(generateJewelIndex)(shiftedMatrix);
        setComboMatrix(filledMatrix);
        setMatrix(filledMatrix);
        mutateJewelIndexOf(board)(filledMatrix).mutate();
        await wait();

        moveHadHits = true;
        return updateUntilNoCombos();
    })();

    return moveHadHits;
};

export const revertBoard = (oldMatrix) => {

    mutateJewelIndexOf(board)(oldMatrix).mutate();
};
