import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function ResetPw(props) {

    const [email, setEmail] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email);
            alert('이메일을 보냈습니다.');
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <ResetPwContainer>
            <div className='container'>
                <h2>비밀번호 재설정</h2>
                <form onSubmit={onSubmit}>
                    <input type="email"
                        placeholder='가입한 이메일'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required />
                    <button className='sendBtn'>보내기</button>
                </form>
            </div>
        </ResetPwContainer>
    );
}

export default ResetPw;

const ResetPwContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 100px 0;
    .container{
        width: 300px;
        height: 200px;
    }
    h2{
        margin: 20px 0 100px;
        color: #333;
        font-size: 22px;
        font-family: Noto Sans KR;
    }
    form{
        input{
            width: 100%;
            height: 30px;
            padding: 6px 12px;
            border: 1px solid #999;
            border-radius: 6px;
            font-size: 16px;
        }
        input::placeholder{
            font-family: Noto Sans KR;
        }
        .sendBtn{
            width: 325.6px;
            padding: 10px 20px;
            margin-top: 40px;
            border: none;
            color: #fff;
            background-color: cornflowerblue;
            border-radius: 6px;
            font-size: 16px;
            font-family: Noto Sans KR;
            font-weight: 600;
        }
        
    }
`