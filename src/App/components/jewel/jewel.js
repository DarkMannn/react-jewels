import React, { useState, useEffect } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const JewelCss = css`
    border: 2px solid black;
    width: 90%;
    height: 90%;
    background-color: ${({ backgroundColor = 'khaki' }) => backgroundColor};
`;

function Jewel({ backgroundColor }) {
    return <div backgroundColor={backgroundColor} css={JewelCss}></div>;
};

export default Jewel;
