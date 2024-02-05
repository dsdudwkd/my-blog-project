import React, { useState } from 'react';
import styled from 'styled-components';
import { sendEmail } from '../api/gmail';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../api/firebase';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

function Join(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');

    const [nameErr, setNameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [duplicatedErr, setDuplicatedErr] = useState('');
    const [pwErr, setPwErr] = useState('');
    const [pwConfirmErr, setPwConfirmErr] = useState('');

    const nameRegex = /^[가-힣a-zA-Z]+$/;
    const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,16}$/;

    const navigate = useNavigate();

    const handleJoin = async (event) => {
        event.preventDefault();
        setNameErr('');
        setEmailErr('');
        setPwErr('');
        setPwConfirmErr('');

        if (name.trim() === '' || name.length <= 1 || !nameRegex.test(name)) {
            setNameErr('이름을 정확히 입력해주세요');
        }
        if (!emailRegex.test(email)) {
            setEmailErr('이메일 형식에 맞게 입력해주세요.');
        }
        if (pw.length < 8 || !pwRegex.test(pw)) {
            setPwErr('비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
        }
        if (pw2.length < 1) {
            setPwConfirmErr('비밀번호를 입력하세요')
        }

        try {
            const auth = getAuth();
            const userAccount = await createUserWithEmailAndPassword(auth, email, pw);
            const user = userAccount.user;
            await updateProfile(user, {
                displayName: name
            })
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/email-already-in-use') {
                    setDuplicatedErr('이미 사용 중인 이메일입니다.')
                }
            }
        }

    };

    return (
        <JoinWrapper>
            <div className='container'>
                <h2>JOIN</h2>
                <form onSubmit={handleJoin} className='joinContainer'>
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
                                    } else{
                                        return setNameErr('');
                                    }
                                }}
                            />
                            {nameErr && <span>{nameErr}</span>}
                        </div>
                    </div>
                    {<div className='emailWrap wrap'>
                        <label htmlFor="email">이메일</label>
                        <div>
                            <input type="text"
                                id='email' placeholder='이메일을 입력해주세요'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                onBlur={() => {
                                    if (!emailRegex.test(email)) {
                                        setEmailErr('이메일 형식에 맞게 입력해주세요.');
                                    } else {
                                        setEmailErr('');
                                    }
                                }}
                            />
                            {duplicatedErr && <span>{duplicatedErr}</span> || emailErr && <span>{emailErr}</span>}
                        </div>
                    </div>}
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
                    <button type='submit' className='joinBtn'>가입하기</button>
                </form>
            </div>
        </JoinWrapper>

    );
}

export default Join;

const JoinWrapper = styled.div`
    padding: 24px;
    .container{
        width: 650px;
        h2{
            text-align: center;
            font-size: 30px;
            font-family: Noto Sans KR;
            margin: 50px auto;
        }
        .joinContainer{
            /* padding: 36px; */
            display: flex;
            flex-direction: column;
            gap: 30px;
            justify-content: center;
            .wrap{
                display: flex;
                align-items: center;
                label{
                    width: 150px;
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
                .emailWrap > div{
                    display: flex;
                    flex-direction: row;
                }
                .emailAuthBtn{
                    /* width: 80px; */
                    height: 44px;
                    background-color: transparent;
                    color: #425867;
                    font-size: 16px;
                    font-weight: 600;
                    font-family: Noto Sans KR;
                    border: none;
                    border-radius: 6px;
                }
                span{
                    color: red;
                    font-size: 12px;
                    display: block;
                    margin-top: 8px;
                }
            }
            
            .joinBtn{
                width: 150px;
                padding: 6px 12px;
                margin: 0 auto;
                margin-top: 70px;
                border: none;
                border-radius: 6px;
                color: #fff;
                background-color: #778dfc;
                font-size: 18px;
                font-family: Noto Sans KR;
            }
        }
    }
`
