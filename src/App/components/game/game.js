import React, { useState, useEffect } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import Board from '../board/board.js';

const GameCss = css`
    display: grid;

    @media screen
    and (max-width: 600px) {
        grid-template: repeat(8, 40px) / repeat(9, 40px);
    }

    @media screen
    and (min-width: 600px)
    and (max-width: 800px) {
        grid-template: repeat(8, 60px) / repeat(9, 60px);
    }

    @media screen
    and (min-width: 800px)
    and (max-width: 1200px) {
        grid-template: repeat(8, 70px) / repeat(9, 70px);
    }

    @media screen
    and (min-width: 1200px) {
        grid-template: repeat(8, 100px) / repeat(9, 100px);
    }

    border: 4px double black;
`;

const TitleCss = css`
    grid-area: 1 / 2 / 2 / 9;
    @media screen
    and (max-width: 600px) {
        font-size: 1vh;
    }

    @media screen
    and (min-width: 600px)
    and (max-width: 800px) {
        font-size: 2vh;
    }

    @media screen
    and (min-width: 800px)
    and (max-width: 1200px) {
        font-size: 3vh;
    }

    @media screen
    and (min-width: 1200px) {
        font-size: 4vh;
    }
`;

const ScoreCss = css`
    grid-area: 3 / 2 / 5 / 3;
    background-color: purple;
`;

const HintCss = css`
    grid-area: 7 / 2 / 8 / 3;
    background-color: orange;
`;

function Game({ backgroundColor }) {
    return (
        <div css={GameCss}>
            <p css={TitleCss}>
                Welcome To React-Jewels Game
            </p>
            <div css={ScoreCss}>Score: 300</div>
            <div css={HintCss}>Hint</div>
            <Board></Board>
        </div>
    );
};

export default Game;
