import React, { useEffect, useState } from 'react';
import UserData from './UserData';
import { onUserState, auth, db } from '../api/firebase';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import styled from 'styled-components';

function Replies(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState('');
    const [reply, setReply] = useState('');

    const onChange = (e) => {
        setReply(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(!user || reply === '' || isLoading) return;

        try{
            setIsLoading(true);
            await addDoc(collection(db, 'replies'),{
                reply,
                userId: user.uid,
                createdAt: Date.now(),
            })
        }catch(error){
            console.error(error);
        }finally{
            setIsLoading(false);
            setReply('');
        }
    }

    useEffect(() => {
        onUserState((user) => {
            setUser(user);
        })
    }, [])



    return (
        <ReplyWrapper className='container'>
            <div className='replyTitle'>댓글</div>
            <form onSubmit={onSubmit}>
                <div className='replyArea'>
                    {/* <img src={auth.currentUser.photoURL} alt={auth.currentUser.displayName} /> */}
                    <div>
                        {/* <span>{auth.currentUser.displayName}</span> */}
                        <input
                            type="text"
                            placeholder='내용을 입력하세요.'
                            onChange={onChange}
                            value={reply}
                        />
                    </div>
                    <button type='submit'>
                        {isLoading? '업로드 중' : '등록'}
                    </button>
                </div>
            </form>
        </ReplyWrapper>
    );
}

export default Replies;

const ReplyWrapper = styled.div`
    img{
        width: 40px;
        height: 40px;
        border-radius: 100%;
    }
`