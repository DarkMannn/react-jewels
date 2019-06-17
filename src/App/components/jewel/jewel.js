import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import { BOARD_HEIGHT } from '../../game-engine/engine.js';

const JewelCss = css`
    border: ${({ focused, combo }) => {
        if (focused) return '4px solid lightgrey';
        if (combo) return '4px solid black';
        return '2px solid black'
    }};
    background-color: ${({ backgroundColor = 'darkgrey' }) => backgroundColor};
    grid-area: ${({ x, y }) => `${BOARD_HEIGHT - y} / ${x + 1} / auto / auto`}
`;

function Jewel({
    backgroundColor, x, y, onItemClick, isFocused, isInCombo
}) {
    return <div
        backgroundColor={backgroundColor}
        focused={isFocused}
        combo={isInCombo}
        x={x}
        y={y}
        onClick={() => onItemClick(x, y)}
        css={JewelCss}></div>;
};

export default Jewel;
