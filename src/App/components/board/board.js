import React, { useState, useEffect } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import Jewel from '../jewel/jewel.js';
import {
    initialMatrix,
    updateBoardUntilNoCombos,
    updateBoardWithMatrix,
    revertBoard,
    createTwoFieldSwappedMatrix
} from '../../engine/engine.js';
import { JewelsIndexHash } from '../../engine/jewels.js';
import { wait } from '../../utils/utils.js';

const BoardCss = css`
    display: grid;
    grid-template: repeat(8, 1fr) / repeat(8, 1fr);
    grid-area: 3 / 4 / 8 / 9;
    gap: 0.4%;
`;

const areItemsAdjacent = (firstItem, secondItem) =>
    (firstItem.x === secondItem.x && Math.abs(firstItem.y - secondItem.y) === 1) ||
    (firstItem.y === secondItem.y && Math.abs(firstItem.x - secondItem.x) === 1);
const doItemsMatch = (firstItem, secondItem) =>
    firstItem && secondItem && firstItem.x === secondItem.x && firstItem.y === secondItem.y;

function Board({ bumpScore }) {
    const [matrix, setMatrix] = useState(initialMatrix);
    const [firstItem, setFirstItem] = useState(null);
    const [secondItem, setSecondItem] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [comboMatrix, setComboMatrix] = useState(initialMatrix);

    useEffect(() => {

        updateBoardUntilNoCombos({ setMatrix, setComboMatrix, bumpScore })
            .then(() => setIsProcessing(false));
    }, [bumpScore]);

    async function onItemClick(x, y) {

        const oldMatrix = matrix;
        if (isProcessing) {
            return;
        }
        if (!firstItem) {
            return setFirstItem({ x, y });
        }
        if (firstItem && firstItem.x === x && firstItem.y === y) {
            return setFirstItem(null);
        }
        if (firstItem && areItemsAdjacent(firstItem, { x, y })) {
            setIsProcessing(true);
            setSecondItem({ x, y });
            await wait()

            const newMatrix = createTwoFieldSwappedMatrix(firstItem)({ x, y })(oldMatrix);
            setMatrix(newMatrix);
            await wait();

            setFirstItem(null);
            setSecondItem(null);
            const moveHadHits = await updateBoardWithMatrix({
                newMatrix,
                setMatrix,
                setComboMatrix,
                bumpScore
            });
            if (!moveHadHits) {
                setMatrix(oldMatrix);
                revertBoard(oldMatrix);
            }
            setIsProcessing(false);
        }
    };

    return <div css={BoardCss}>{
        matrix.map((xArray, x) =>
            xArray.map((yField, y) =>
                <Jewel
                    key={(8 * x) + y}
                    x={x}
                    y={y}
                    isFocused={doItemsMatch({ x, y }, firstItem) || doItemsMatch({ x, y }, secondItem)}
                    isInCombo={comboMatrix[x][y] === null}
                    backgroundColor={JewelsIndexHash[matrix[x][y]]}
                    onItemClick={onItemClick}></Jewel>
            )
        )
    }</div>;
};

export default Board;
