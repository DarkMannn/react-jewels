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

    border: 8px double black;
    background-color: darkgray;
`;

const TitleCss = css`
    grid-area: 1 / 1 / 2 / 10;
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

    background-color: #1A1A1A;
    color: white;
    font-weight: bold;
    border-bottom: 2px solid black;
    margin: 0;
    padding-top: 2%;
`;

const ScoreCss = css`
    grid-area: 3 / 1 / 4 / 4;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #0099CC;
    border-radius: 30px;
    background-color: #5A5A5A;
    color: #0099CC;
    font-weight: bold;
    margin: 0% 5%;
`;

const ScoreNumberCss = css`
    border-radius: 6px;
    margin-left: 5px;
`;

const HintCss = css`
    grid-area: 7 / 2 / 8 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0099CC;
    background: transparent;
    border: 2px solid #0099CC;
    border-radius: 6px;
    margin: 6px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;
    :hover {
        background-color: #008CBA;
        color: white;
    }
`;


function Game({ backgroundColor }) {
    return (
        <div css={GameCss}>
            <p css={TitleCss}>
                React-Jewels Game
            </p>
            <div css={ScoreCss}>
                <span>Score:</span>
                <span css={ScoreNumberCss}>300</span>
            </div>
            <div css={HintCss}>
                <span>Hint</span>
            </div>
            <Board></Board>
        </div>
    );
};

export default Game;
