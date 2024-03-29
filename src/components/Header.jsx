import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { googleLogIn, logOut, onUserState } from '../api/firebase';
import main_name from '../img/main_name.png';
import styled from 'styled-components';
import { useAuthContext } from '../context/AuthContext';
import UserData from './UserData';
import { IoSearch } from "react-icons/io5";
import Search from '../pages/Search';
import CategoryMenu from './CategoryMenu';

function Header(props) {

    const [user, setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        onUserState((user) => {
            setUser(user);
        })
    }, []);

    //로그인
    const userLogIn = () => {
        googleLogIn().then(setUser);
    }

    //로그아웃
    const userLogOut = () => {
        const ok = window.confirm('로그아웃 하시겠습니까?');
        if (ok) {
            logOut().then(setUser);
            navigate('/login');
        }
        return;
    }

    return (
        <HeaderContainer>
            <Link to='/'>
                <h1 >Annalog</h1>
            </Link>

            <div>
                {/* 스타일 컴포넌트 */}
                <CategoryItemList>
                    <Link to='/'>
                        <h2>HOME</h2>
                    </Link>
                    <CategoryMenu />
                </CategoryItemList>
            </div>
            <div className='userWrapper'>
                <Link to='/search'>
                    <button className='search'>검색</button>
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
        h1{
            color: black;
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
const CategoryItemList = styled.ul`
    display: flex;
    gap: 30px;
    padding: 24px;
    a{
        position: relative;
        line-height: 23.2px;
        font-weight: 600;
        color: #606060;
        font-family: 'Noto Sans KR','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 16px;
        &:hover{
            color: black;
        }
        &:hover::after, &:focus::after{
            position: absolute;
            content: "";
            top: 68px;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #cb836b;
        }
    }
`
