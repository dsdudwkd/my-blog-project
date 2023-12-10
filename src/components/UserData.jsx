import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { logOut, onUserState } from '../api/firebase';

//로그인한 계정의 정보(프로필 사진, 닉네임) 띄우기 위한 컴포넌트
function UserData({ user: { photoURL, displayName } }) {

    const [user, setUser] = useState('');

    useEffect(() => {
        onUserState((user) => {
            setUser(user);
        })
    }, []);

    //로그아웃
    const userLogOut = () => {
        logOut().then(setUser);
    }

    return (
        <UserDataWrapper>
            <button id='userBtn'>
                <img src={photoURL} alt={`${displayName}의 프로필 사진`} />
                <span className='nickname'>{displayName}님</span>
            </button>
            
        </UserDataWrapper>
    );
}

export default UserData;

const UserDataWrapper = styled.div`
    button{
        display: flex;
        align-items: center;
        gap: 6px;
        img{
            width: 36px;
            border-radius: 100%;
        }
    }
    
`