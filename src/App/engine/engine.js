import {
    traverseAndFindCombos,
    traverseAndFindPotentialCombos,
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
import { wait, repeat } from '../utils/utils.js';

const board = makeBoard();

export const initialMatrix = extractJewelIndexFrom(board);
export { createTwoFieldSwappedMatrix };
export { BOARD_HEIGHT };
export { BOARD_WIDTH };

export async function updateBoardUntilNoCombos({
    hadCombo = false,
    setMatrix,
    setComboMatrix,
    bumpScore
}) {

    const comboMap = traverseAndFindCombos(board);
    const comboCountReducer = (acc, col) => col.length ? acc + 1 : acc;
    const comboCount = comboMap.x.reduce(comboCountReducer, 0) +
        comboMap.y.reduce(comboCountReducer, 0);

    if (!comboCount) {
        return hadCombo || false;
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
    repeat(comboCount)(bumpScore);
    await wait();

    return updateBoardUntilNoCombos({ hadCombo: true, setMatrix, setComboMatrix, bumpScore });
};

export async function updateBoardWithMatrix({ newMatrix, setMatrix, setComboMatrix, bumpScore }) {

    mutateJewelIndexOf(board)(newMatrix).mutate();

    const hadCombos = await updateBoardUntilNoCombos({ setMatrix, setComboMatrix, bumpScore });
    return hadCombos;
};

export function revertBoard(oldMatrix) {

    mutateJewelIndexOf(board)(oldMatrix).mutate();
};

export function getHint() {

    const potentialCombos = traverseAndFindPotentialCombos(board);
    return potentialCombos.length && potentialCombos[0].length && potentialCombos[0][0];
};
