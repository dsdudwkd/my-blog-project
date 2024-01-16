import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';
import styled from 'styled-components';

function Profile(props) {

    const user = auth.currentUser;
    const navigate = useNavigate();

    const deleteAccount = () => {
        const ok = window.confirm('정말 탈퇴 하시겠습니까?');
        if(ok){
            user.delete();
            navigate('/');
        }
    }

    return (
        <ProfileWrapper className='container'>
            <h2>profile</h2>
            
            <Link to='/editCategory'>
                <button>카테고리 편집</button>
            </Link>
                <button onClick={deleteAccount}>회원 탈퇴</button>

        </ProfileWrapper>
    );
}

export default Profile;

const ProfileWrapper = styled.div`
    button{
        cursor: pointer;
    }
`
