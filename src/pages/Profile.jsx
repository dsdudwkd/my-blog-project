import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, logOut, onUserState, storage } from '../api/firebase';
import styled from 'styled-components';
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineCameraAlt } from "react-icons/md";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updatePassword, updateProfile } from 'firebase/auth';

function Profile(props) {

    const user = auth.currentUser;
    const navigate = useNavigate();
    const nameRegex = /^[가-힣a-zA-Z]+$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,16}$/;

    const [currentUser, setCurrentUser] = useState('');
    const [userImg, setUserImg] = useState(user ? user.photoURL : null);
    const [name, setName] = useState(user.displayName);
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');

    const [nameErr, setNameErr] = useState('');
    const [pwErr, setPwErr] = useState('');
    const [pwConfirmErr, setPwConfirmErr] = useState('');

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
            await updatePassword(user, pw);
            if (fileSize > maxSize) { //사진 1MB 용량만 첨부할 수 있도록 추가
                alert('업로드 가능한 최대 이미지 용량은 1MB입니다.');
                return;
            }
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setNameErr('');
        setPwErr('');
        setPwConfirmErr('');

        if (name.trim() === '' || name.length <= 1 || !nameRegex.test(name)) {
            setNameErr('이름을 정확히 입력해주세요');
        }
        if (pw.length < 8 || !pwRegex.test(pw)) {
            setPwErr('비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
        }
        if (pw2.length < 1) {
            setPwConfirmErr('비밀번호를 입력하세요')
        }

        try {
            await updateProfile(user, {
                displayName: name,
            })
            await updatePassword(user, pw);
            alert('정상적으로 수정되었습니다.');
        } catch (error) {
            console.error(error);
        }
        setPw('');
        setPw2('');
    }

    const deleteAccount = () => {
        const ok = window.confirm('정말 탈퇴 하시겠습니까?');
        if (ok) {
            user.delete();
            navigate('/');
        }
    }
    return (
        <>
            <SideMenu>
                <Link to='/editCategory'>
                    <button className='editCategoryBtn'>카테고리 편집</button>
                </Link>
            </SideMenu>
            <ProfileWrapper className='container'>
                <h2 className='title'>profile</h2>
                {user &&
                    <>
                        <div className='userImg'>
                            <label htmlFor="userImg">
                                {userImg ? <img className='updateImg' src={userImg} alt='user의 프로필 사진' /> : <FaUserCircle className='updateImg' />}
                                <MdOutlineCameraAlt className='camera' />
                            </label>
                            <input type="file" id='userImg' accept="image/*" onChange={onFileChange} />
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className='nameWrap wrap'>
                                <label htmlFor="yourName">이름</label>
                                <div>
                                    <input type="text" id='yourName'
                                        placeholder='이름을 입력하세요'
                                        value={name}
                                        onChange={(e) => { setName(e.target.value) }}
                                        onBlur={() => {
                                            if (name.trim() === '' || name.length <= 1 || !nameRegex.test(name)) {
                                                return setNameErr('이름을 정확히 입력해주세요.');
                                            } else {
                                                return setNameErr('');
                                            }
                                        }}
                                    />
                                    {nameErr && <span>{nameErr}</span>}
                                </div>
                            </div>
                            <div className='emailWrap wrap'>
                                <label htmlFor="email">이메일</label>
                                <div>
                                    <input type="text"
                                        id='email' placeholder='이메일을 입력해주세요'
                                        value={user.email}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className='pwWrap wrap'>
                                <label htmlFor="password">비밀번호</label>
                                <div>
                                    <input type="password"
                                        id='password'
                                        placeholder='영문자,숫자,특수문자 포함 최소8~16자'
                                        value={pw}
                                        onChange={(e) => { setPw(e.target.value) }}
                                        onBlur={() => {
                                            if (pw.length < 8 || !pwRegex.test(pw)) {
                                                return setPwErr('비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
                                            } else {
                                                setPwErr('');
                                            }
                                        }}
                                        minLength={8}
                                        maxLength={16}
                                    />
                                    {pwErr && <span>{pwErr}</span>}
                                </div>

                            </div>
                            <div className='pwConfirmWrap wrap'>
                                <label htmlFor="passwordConfirm">비밀번호 확인</label>
                                <div>
                                    <input type="password"
                                        id='passwordConfirm'
                                        placeholder='비밀번호를 확인해주세요'
                                        value={pw2}
                                        onChange={(e) => { setPw2(e.target.value) }}
                                        onBlur={() => {
                                            if (pw !== pw2) {
                                                return setPwConfirmErr('비밀번호가 일치하지 않습니다.');

                                            } else if (pw2.length < 1) {
                                                return setPwConfirmErr('비밀번호를 입력해주세요');
                                            } else {
                                                setPwConfirmErr('');
                                            }
                                        }}
                                        minLength={8}
                                        maxLength={16} />
                                    {(pwConfirmErr && <span>{pwConfirmErr}</span>)}
                                </div>
                            </div>
                            <p onClick={deleteAccount} className='deleteAcc'>회원 탈퇴</p>
                            <div className='btn'>
                                <button className='editBtn'>수정하기</button>
                                <Link to='/'>
                                    <button>취소</button>
                                </Link>
                            </div>
                        </form>


                    </>
                }

            </ProfileWrapper>
        </>

    );
}

export default Profile;

const SideMenu = styled.aside`
    float: left;
    box-sizing: border-box;
    width: 15.296296296296296%;
    height: 100%;
    padding: 100px 0;
    border-right: 1px solid #e6e6e6;
    .editCategoryBtn{
        margin: 0 auto;
        display: flex;
        align-items: center;
    }
`
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
    .userImg{
        margin-bottom: 30px;
        label{
            cursor: pointer;
            position: relative;
            margin-bottom: 30px;
            .updateImg{
                width: 80px;
                height: 80px;
                border: 1px solid #ecebeb;
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
        #userImg{
            display: none;
        }
    }
    .wrap{
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 18px;
        label{
            width: 120px;
            font-family: Noto Sans KR;
            font-weight: bold;
            color: #434242;
        }
        input{
                    width: 400px;
                    height: 36px;
                    border: none;
                    border-radius: 4px;
                    border: 1px solid #d0d0d0;
                    padding: 4px 8px;
                    background-color: transparent;
                }
                input::placeholder{
                    font-family: Noto Sans KR;
                    color: #999;
                }
                #email{
                    cursor: not-allowed;
                }
    }
    span{
        margin-top: 4px;
        display: block;
        font-size: 12px;
        font-family: Noto Sans KR;
        color: red;
    }
    .deleteAcc{
        float: right;
        font-size: 14px;
        font-weight: 600;
        font-family: Noto Sans KR;
        color: #777;
        cursor: pointer;
        &:hover{
            color: #f3372d;
            transition: 0.3s;
        }
    }
    .btn{
        display: flex;
        justify-content: center;
        margin-top: 100px;
        button{
            width: 120px;
            cursor: pointer;
            border: 1px solid #333;
            border-radius: 6px;
            padding: 12px 24px;
            margin-right: 8px;
            background-color: #fff;
            font-family: Noto Sans KR;
            font-size: 16px;
            &:hover{
                background-color: #f4f4f4;
                transition: 0.3s;
            }
        }
        .editBtn{
            background-color: #0e3066;
            color: #fff;
            border: none;
            &:hover{
                background-color: #2c5ca9;
                transition: 300ms;
            }
        }
    }
    
`
