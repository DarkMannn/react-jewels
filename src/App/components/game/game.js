import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import Board from '../board/board.js';
import { media } from '../../utils/utils.js';

const GameCss = css`
    display: grid;
    ${media.min0max600`grid-template: repeat(8, 40px) / repeat(9, 40px)`}
    ${media.min600max800`grid-template: repeat(8, 60px) / repeat(9, 60px)`}
    ${media.min800max1000`grid-template: repeat(8, 70px) / repeat(9, 70px)`}
    ${media.min1000max1200`grid-template: repeat(8, 85px) / repeat(9, 85px)`}
    ${media.min1200max10000`grid-template: repeat(8, 100px) / repeat(9, 100px)`}
    border: 8px double black;
    background-color: darkgray;
`;
const TitleCss = css`
    grid-area: 1 / 1 / 2 / 10;
    ${media.min0max600`font-size: 1vh`}
    ${media.min600max800`font-size: 2vh`}
    ${media.min800max1000`font-size: 3vh`}
    ${media.min1000max1200`font-size: 4vh`}
    ${media.min1200max10000`font-size: 5vh`}
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
    margin: 0% 15%;
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


function Game() {
    return <div css={GameCss}>
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
    </div>;
};

export default Game;
