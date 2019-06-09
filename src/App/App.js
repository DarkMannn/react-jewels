import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import Game from './components/game/game.js';

const AppCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: gray;
    color: white;
`;

function App() {
  return (
    <div css={AppCss}>
        <Game></Game>
    </div>
  );
}

export default App;
