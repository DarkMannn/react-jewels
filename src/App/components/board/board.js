import React, { useState, useEffect } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import Jewel from '../jewel/jewel.js'
import { repeat } from '../../utils/utils.js';

const BoardCss = css`
    display: grid;
    grid-template: repeat(8, 1fr) / repeat(8, 1fr);
    grid-area: 3 / 4 / 8 / 9;
    gap: 0.2%;
`;

function Board() {
    return (
        <div css={BoardCss}>
            {repeat(64)((key) => <Jewel key={key}></Jewel>)}
        </div>
    );
};

export default Board;
