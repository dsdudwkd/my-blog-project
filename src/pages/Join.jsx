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
    const [authNum, setAuthNum] = useState('');
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');

    const [nameErr, setNameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [duplicatedErr, setDuplicatedErr] = useState('');
    const [pwErr, setPwErr] = useState('');
    const [isSameErr, setIsSameErr] = useState('');

    const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,16}$/;

    const navigate = useNavigate();

    const handleJoin = async (event) => {
        event.preventDefault();

        if (name.trim() === '' || name.length <= 1) {
            setNameErr('이름을 정확히 입력해주세요.');
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailErr('이메일 형식에 맞게 입력해주세요.');
            return;
        }
        if (pw.length < 8 || !pwRegex.test(pw)) {
            setPwErr('비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
            return;
        }
        if (pw !== pw2) {
            setIsSameErr('비밀번호가 일치하지 않습니다.');
            return;
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
                setDuplicatedErr('이미 사용하고 있는 이메일입니다.');
            }
        }
        setNameErr('');
        setEmailErr('');
        setPwErr('');
        setIsSameErr('');
    };


    return (
        <JoinWrapper>
            <div className='container'>
                <h2>JOIN</h2>
                <form onSubmit={handleJoin} className='joinContainer'>
                    <div className='nameWrap wrap'>
                        <label htmlFor="yourName">이름</label>
                        <div>
                            <input type="text" id='yourName' placeholder='이름을 입력하세요' value={name} onChange={(e) => { setName(e.target.value) }} />

                            {nameErr && <span>{nameErr}</span>}
                        </div>
                    </div>
                    <div className='emailWrap wrap'>
                        <label htmlFor="email">이메일</label>
                        <div>
                            <input type="text" id='email' placeholder='이메일을 입력해주세요' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            {<span>{duplicatedErr}</span>}
                            <button className='emailAuthBtn' onClick={sendEmail}>인증하기</button>
                            {emailErr && <span>{emailErr}</span>}
                        </div>

                    </div>
                    <div className='emailAuthWrap wrap'>
                        <label htmlFor="emailAuthText">인증번호</label>
                        <input type="text" id='emailAuthText' placeholder='인증번호를 입력하세요' value={authNum} />

                    </div>
                    <div className='pwWrap wrap'>
                        <label htmlFor="password">비밀번호</label>
                        <div>
                            <input type="password" id='password' placeholder='영문자,숫자,특수문자 포함 최소8~16자' value={pw}
                                onChange={(e) => { setPw(e.target.value) }} minLength={8} maxLength={16} />
                            {pwErr && <span>{pwErr}</span>}
                        </div>

                    </div>
                    <div className='pwConfirmWrap wrap'>
                        <label htmlFor="passwordConfirm">비밀번호 확인</label>
                        <div>
                            <input type="password" id='passwordConfirm' placeholder='비밀번호를 확인해주세요' value={pw2}
                                onChange={(e) => { setPw2(e.target.value) }} minLength={8} maxLength={16} />
                            {isSameErr && <span>{isSameErr}</span>}
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
                    border-radius: 4px;
                    border: 1px solid #999;
                    padding: 4px 8px;
                }
                input::placeholder{
                    font-family: Noto Sans KR;
                    color: #999;
                }
                #email{
                }
                .emailAuthBtn{
                    width: 80px;
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
