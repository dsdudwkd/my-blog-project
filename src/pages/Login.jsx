import React from 'react';
import { googleLogIn, googleLogOut } from '../api/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import styled from 'styled-components';

function Login(props) {

    const navigate = useNavigate();
    const googleLogin = async (e) => {
        const user = await googleLogIn();
        navigate('/');
    }

    return (
        <LogInContainer>
            <div className='container'>
                <h2>Login</h2>
                <form onSubmit={googleLogin}>
                    <div className='inputContainer'>
                        <input type="text" placeholder='이메일' className='email'/>
                        <input type="password" placeholder='비밀번호' className='pw' />
                    </div>

                    <button className='logInBtn'>로그인</button>
                    <button onClick={googleLogIn} className='googleBtn'>
                        <FcGoogle className='googleSvg' />
                    </button>
                </form>
                <Link to='/join' className='join'>
                    회원가입
                </Link>
            </div>
        </LogInContainer>

    );
}

export default Login;

const LogInContainer = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    text-align: center;
    .container{
        width: 400px;
        h2{
            margin-bottom: 50px;
            font-size: 30px;
            font-family: Noto Sans KR;
        }
        form{
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