import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import Jewel from './components/jewel/jewel.js'

const AppCss = css`
    text-align: center;
    background-color: gray;
    color: white;
`;

function App() {
  return (
    <div css={AppCss}>
        <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
            This is my text!
        </p>
        <Jewel backgroundColor='green'></Jewel>
        <Jewel backgroundColor='purple'></Jewel>
        <Jewel backgroundColor='orange'></Jewel>
    </div>
  );
}

export default App;
