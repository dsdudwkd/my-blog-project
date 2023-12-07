import React, { useState } from 'react';
import { googleLogIn, googleLogOut, loginEmail } from '../api/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import styled from 'styled-components';

function Login(props) {

    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const googleLogin = async (e) => {
        const user = await googleLogIn();
        navigate('/');
    }
    const emailLogin = async (e) => {
        e.preventDefault();

        try{
            const user = await loginEmail(email, pw);
            if(user){
                navigate('/');
            } else{
                setErrMsg('이메일 혹은 비밀번호가 일치하지 않습니다')
            }
        } catch(error){
            console.error(error);
        }
    }

    return (
        <LogInWrapper>
            <div className='container'>
                <h2>Login</h2>
                <form onSubmit={emailLogin} className='logInContainer'>
                    <div className='inputContainer'>
                        <input type="text" placeholder='이메일' className='email' value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                        <input type="password" placeholder='비밀번호' className='pw' value={pw} 
                            onChange={(e) => {setPw(e.target.value)}}
                        />
                    </div>

                    <button type='submit' className='logInBtn'>로그인</button>
                    <button onClick={googleLogin} className='googleBtn'>
                        <FcGoogle className='googleSvg' />
                    </button>
                </form>
                <Link to='/join' className='join'>
                    회원가입
                </Link>
            </div>
        </LogInWrapper>

    );
}

export default Login;

const LogInWrapper = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    text-align: center;
    .container{
        width: 400px;
        h2{
            margin: 50px auto;
            font-size: 30px;
            font-family: Noto Sans KR;
        }
        .logInContainer{
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
            .inputContainer{
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-bottom: 25px;
                input{
                    width: 100%;
                    padding: 12px 0;
                    border: none;
                    border-bottom: 1px solid #b3b2b2;
                    background-color: transparent;
                }
                input::placeholder{
                    font-family: Noto Sans KR;
                }
            }
            .logInBtn{
                padding: 12px 24px;
                font-size: 18px;
                font-weight: bold;
                font-family: Noto Sans KR;
                color: #fff;
                background-color: #4c87bf;
                border-radius: 10px;
            }
        }
        button{
            border: none;

        }
        .googleBtn{
            width: 50px;
            margin: 0 auto;
            margin-bottom: 20px;
            padding: 10px 12px ;
            background-color: transparent;
            border-radius: 100%;
            border: 0.3px solid #efebeb;
            .googleSvg{
                width: 100%;
                height: 100%;
            }
        }
        .join{
            color: #333;
            font-size: 12px;
        }
    }
        
`