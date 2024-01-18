import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { googleLogIn, logOut, onUserState } from '../api/firebase';
import main_name from '../img/main_name.png';
import styled from 'styled-components';
import { useAuthContext } from '../context/AuthContext';
import UserData from './UserData';
import CategoryMenu from './CategoryMenu';
import { IoSearch } from "react-icons/io5";

function Header(props) {

    const [user, setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        onUserState((user) => {
            setUser(user);
        })
    }, [])

    //로그인
    const userLogIn = () => {
        googleLogIn().then(setUser);
    }

    //로그아웃
    const userLogOut = () => {
        logOut().then(setUser);
        navigate('/login');
    }

    return (
        <HeaderContainer>
            <Link to='/'>
                <h1 >Annalog</h1>
            </Link >

            <nav>
                {/* <CategoryMenu /> */}
            </nav>
            <div className='userWrapper'>
                <Link to='/search'>
                    <IoSearch className='search' />
                </Link>

                {user && user.isAdmin && (
                    <>
                        <Link to='/newPost'>
                            <button className='newPostBtn'>글쓰기</button>
                        </Link>
                        
                    </>

                )}
                {user ?
                    (
                        <>
                            {user &&
                                <Link to='/profile'>
                                    <UserData user={user} />
                                </Link>}
                            <button className='logOutBtn' onClick={userLogOut}>로그아웃</button>
                        </>
                    ) :
                    (
                        <Link to='/login'>
                            <button className='logInBtn'>로그인</button>
                        </Link>
                    )}

            </div>
        </HeaderContainer>
    );
}

export default Header;

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 12px;
    gap: 24px;
    border-bottom: 1px solid #e6e6e6;
    a{
        color: black;
        font-family: monospace;
        h1{
            font-size: 50px;
            font-family: Ephesis;
        }
    }

    .userWrapper{
        display: flex;
        align-items: center;
        gap: 24px;
        svg{
            width: 25px;
            height: 25px;
            color: #555;
            padding: 6px;
        }
        button{
            border: none;
            background-color: transparent;
            font-size: 16px;
            font-family: Noto Sans KR, Arial, Helvetica, sans-serif;
            &.newPostBtn{
                background-color: #333;
                border-radius: 20px;
                color: #fff;
                padding: 8px 24px;
            }
            &:hover{
                font-weight: 600;
            }
        }
        
    }

    
`

