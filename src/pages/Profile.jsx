import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, onUserState, storage } from '../api/firebase';
import styled from 'styled-components';
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineCameraAlt } from "react-icons/md";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

function Profile(props) {

    const user = auth.currentUser;
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState('');
    const [userImg, setUserImg] = useState(user ? user.photoURL : null);

    useEffect(() => {
        onUserState((user) => {
            setCurrentUser(user);
        })
    }, [user])

    const onFileChange = async (e) => {
        e.preventDefault();
        const { files } = e.target;
        const fileSize = files[0].size;
        const maxSize = 1024 * 1024 * 1;

        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `userImgs/${user.uid}`);
            const snapShot = await uploadBytes(locationRef, file);
            const url = await getDownloadURL(snapShot.ref);
            setUserImg(url);
            await updateProfile(user, {
                photoURL: url,
            })
            if (fileSize > maxSize) { //사진 1MB 용량만 첨부할 수 있도록 추가
                alert('업로드 가능한 최대 이미지 용량은 1MB입니다.');
                return;
            }
        }
    };

    const deleteAccount = () => {
        const ok = window.confirm('정말 탈퇴 하시겠습니까?');
        if (ok) {
            user.delete();
            navigate('/');
        }
    }
    return (
        <ProfileWrapper className='container'>
            <h2 className='title'>profile</h2>
            {user && user.photoURL &&
                <>
                    <div>
                        <label htmlFor="userImg">
                            {userImg ? <img className='updateImg' src={userImg} alt='user의 프로필 사진' /> : <FaUserCircle className='updateImg' />}
                            <MdOutlineCameraAlt className='camera' />
                        </label>
                        <input type="file" id='userImg' accept="image/*" onChange={onFileChange} />
                    </div>
                    <div>
                        {user ? <span>{user.displayName}</span> : 'Anonymous'}
                    </div>
                    
                    <Link to='/editCategory'>
                        <button>카테고리 편집</button>
                    </Link>
                    <button onClick={deleteAccount}>회원 탈퇴</button>

                </>
            }

        </ProfileWrapper>
    );
}

export default Profile;

const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 50px;
    .title{
        font-size: 35px;
        margin-bottom: 20px;
    }
    label{
        cursor: pointer;
        position: relative;
        .updateImg{
            width: 80px;
            height: 80px;
            border-radius: 100%;
        }
        svg{
            color: #0e3066;
        }
        .camera{
            position: absolute;
            top: -8px;
            left: 55px;
            border-radius: 100%;
            padding: 6px;
            background-color: black;
            color: #fff;
            z-index: 9;
        }
    }
    input{
        display: none;
    }
    span{
        font-size: 24px;
        font-family: Noto Sans KR;
    }
    button{
        cursor: pointer;
        border: none;

    }

`
