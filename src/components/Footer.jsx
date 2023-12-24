import React from 'react';
import styled from 'styled-components';

function Footer(props) {
    return (
        <FooterWrapper>
            <div>
                <p className='logo'>Annalog</p>
                <p>made by anna Do</p>
            </div>
            <div className='address'>
                <p>E-Mail: dsdudwkd@google.com</p>
                <p>gitHub: https://github.com/dsdudwkd</p>
                <p>blog: https://dsdudwkd.tistory.com/</p>
            </div>
        </FooterWrapper>
    );
}

export default Footer;

const FooterWrapper = styled.div`
    padding: 30px;
    border-top: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #888;
    font-family: Noto Sans KR;
    .logo{
        color: black;
        font-family: monospace;
        font-size: 50px;
        font-family: Ephesis;
        margin-bottom: 30px;
    }
    .address{
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 14px;
    }
`