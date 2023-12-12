import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { googleLogIn, logOut, onUserState } from '../api/firebase';
import main_name from '../img/main_name.png';
import styled from 'styled-components';
import { useAuthContext } from '../context/AuthContext';
import UserData from './UserData';
import CategoryMenu from './CategoryMenu';

function Header(props) {

    const [user, setUser] = useState('');

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
    }

    return (
        <HeaderContainer>
            <Link to='/'>
                <h1 >Annalog</h1>
            </Link >

            <nav>
                <CategoryMenu />
            </nav>
            <div className='userWrapper'>
                <Link to='/search'>SEARCH</Link>

                {user && user.isAdmin && (
                    <>
                        <Link to='/newPost'>
                            <button className='newPostBtn'>글쓰기</button>
                        </Link>
                        <Link to='editCategory'>
                            <button>카테고리 편집</button>
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
                            <button className='logOutBtn' onClick={userLogOut}>LOGOUT</button>
                        </>
                    ) :
                    (
                        <Link to='/login'>
                            <button className='logInBtn'>LOGIN</button>
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
    padding: 12px;
    gap: 24px;
    a{
        color: black;
        h1{
            font-size: 50px;
            font-family: Ephesis;
        }
    }

    .userWrapper{
        display: flex;
        align-items: center;
        gap: 24px;
        font-size: 16px;
        font-family: Noto Sans KR, Arial, Helvetica, sans-serif;
        button{
            border: none;
            background-color: transparent;
            padding: 6px 12px;
            font-size: 16px;
        }
        
    }

    
`