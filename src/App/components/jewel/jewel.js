import React from 'react';
import styled from 'styled-components';
import 'styled-components/macro';
import { BOARD_HEIGHT } from '../../engine/engine.js';

const JewelDiv = styled.div.attrs(({ focused, combo, x, y, backgroundColor }) => ({
    style: {
        border: focused ? '4px solid lightgrey' : combo ? '4px solid black' : '2px solid black',
        backgroundColor: backgroundColor || 'darkgrey',
        gridArea: `${BOARD_HEIGHT - y} / ${x + 1} / auto / auto`
    }
}))``;

function Jewel({ backgroundColor, x, y, onItemClick, isFocused, isInCombo }) {
    return <JewelDiv
        backgroundColor={backgroundColor}
        focused={isFocused}
        combo={isInCombo}
        x={x}
        y={y}
        onClick={() => onItemClick(x, y)}></JewelDiv>;
};

export default Jewel;
