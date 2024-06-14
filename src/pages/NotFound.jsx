import React from 'react';
import styled from 'styled-components';

function NotFound(props) {
    return (
        <ErrorPageEvent>
            <h1>404 Error!</h1>
            <p>잘못된 접근입니다.</p>
        </ErrorPageEvent>
    );
}

export default NotFound;

const ErrorPageEvent = styled.div`
    background: url('./img/skull.png') no-repeat center / center;
    h1{
        font-family: Noto Sans KR;
        font-weight: 600;
        font-size: 20px;
        color: #d03b3b;
    }
    p{
        display: block;
        font-size: 18px;
        font-family: Noto Sans KR;
        color: #666;
    }
`