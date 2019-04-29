import React from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const AppCss = css`
    text-align: center;
    background-color: orange;
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
    </div>
  );
}

export default App;
