import React from 'react';
import { FadeLoader } from "react-spinners";
import styled from 'styled-components';
function Loading(props) {
    return (
        <Wrapper>
            <FadeLoader color='white' radius={3} width={7} />
        </Wrapper>
    );
}

export default Loading;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 700px;
    border: none;
    background-color: #333;
    background-blend-mode: multiply;
`