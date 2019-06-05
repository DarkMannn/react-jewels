import React, { useState, useEffect } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

const JewelCss = css`
    border: 2px solid black;
    width: 12.5px;
    height: 12.5px;
    background-color: ${({ backgroundColor }) => backgroundColor};
`;

function Jewel({ backgroundColor }) {
    return <div backgroundColor={backgroundColor} css={JewelCss}></div>;
};

export default Jewel;
