import { set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { IoIosArrowUp } from "react-icons/io";
import styled from 'styled-components';

function TopBtn(props) {

    const [showTopBtn, setShowTopBtn] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset >= 80) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        })
    }, [])

    const scrollTopEvent = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const toggleVisible = () => {
        if (window.pageYOffset > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', toggleVisible);
        return () => {
            window.removeEventListener('scroll', toggleVisible); //마운트가 해제될 때 이벤트까지 삭제
        }
    }, [])

    return (
            (isVisible &&
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Button onClick={scrollTopEvent} >
                        <IoIosArrowUp  />
                    </Button>
                </div>
            )
    );
}

export default TopBtn;

const Button = styled.button`
    padding: 10px;
    display: flex;
    text-align: center;
    align-items: center;
    font-size: 22px;
    border: none;
    border-radius: 100%;
    background-color: #333;
    color: #fff;
`