import React, { useState } from 'react';
import { googleLogIn, loginEmail, gitHubLogin } from '../api/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import styled from 'styled-components';
import { AuthCredential, getAuth } from 'firebase/auth';
import UserData from '../components/UserData';

function Login(props) {


    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const googleLogin = async () => {
        const user = await googleLogIn();
        navigate('/');
    }

    const emailLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await loginEmail(email, pw);
            if (user) {
                navigate('/');
            } else {
                setErrMsg('이메일 혹은 비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const githubLogin = async () => {
        const user = await gitHubLogin();
        navigate('/');
    }

    return (
        <LogInWrapper>
            <div className='container'>
                <h2>Login</h2>
                <form onSubmit={emailLogin} className='logInContainer'>
                    <div className='inputContainer'>
                        <input type="text" placeholder='이메일' className='email' value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <input type="password" placeholder='비밀번호' className='pw' value={pw}
                            onChange={(e) => { setPw(e.target.value) }}
                        />
                        <p>{errMsg}</p>
                    </div>
                    <button type='submit' className='logInBtn'>로그인</button>
                </form>
                
                <Link to='/resetPw' className='forgotPw'>비밀번호를 잊으셨습니까? &rarr;</Link>
                <div className='socialLoginWrapper'>
                        <h3 className='socialLoginTitle'>소셜 로그인</h3>
                        <button onClick={googleLogin} className='googleBtn'>
                            <FcGoogle className='googleSvg' />
                        </button>
                        <button onClick={githubLogin} className='gitHubBtn'>
                            <SiGithub className='gitHubSvg'/>
                        </button>
                    </div>
                <Link to='/join' className='join'>
                    회원가입
                    {/* &rarr;는 화살표 표시 */}
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
            p{
                color: red;
                font-size: 12px;
                display: flex;
                justify-content: flex-start;
                margin-top: 10px;
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
        .forgotPw{
            display: flex;
            justify-content: flex-end;
            font-size: 14px;
            font-family: Noto Sans KR;
            color: #4d4141;
            margin-top: 4px;
        }
        .socialLoginWrapper{
            .socialLoginTitle{
                font-size: 14px;
                font-weight: 500;
                font-family: Noto Sans KR;
                margin: 20px 0;
                color: #444;
            }
            .googleBtn, .gitHubBtn{
                width: 50px;
                margin: 0 auto;
                margin-bottom: 20px;
                padding: 10px 12px ;
                background-color: transparent;
                border-radius: 100%;
                border: 0.3px solid #efebeb;
                .googleSvg, .gitHubSvg{
                    width: 100%;
                    height: 100%;
                }
            }
            .gitHubBtn{
                margin-left: 100px;
            }
            
        }
        .join{
            color: #333;
            font-size: 14px;
            font-family: Noto Sans KR;
        }
    }
        
`