import React, { useEffect, useState } from 'react';
import UserData from './UserData';
import { onUserState, auth, db } from '../api/firebase';
import { addDoc, collection, doc, documentId, getDoc, getFirestore, query, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import styled from 'styled-components';

function Replies(post) {

    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState('');
    const [reply, setReply] = useState('');
    const user = auth.currentUser;
    // console.log(post)
    const onChange = (e) => {
        setReply(e.target.value);
    }
    // console.log(post)
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!user || reply === '' || isLoading) return;

        try {
            setIsLoading(true);
            //글(문서) Id 
            const postId = post.postId;
            console.log(postId)
            //해당 글에 대한 댓글 작성을 위해 하위 컬렉션 생성
            const repliesRef = collection(db, 'posts', postId, 'replies');
            // 댓글 데이터 작성
            await addDoc(repliesRef, {
                reply,
                userId: user.uid,
                createdAt: Date.now(),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setReply('');
        }
    }

    useEffect(() => {
        onUserState((user) => {
            setUserInfo(user);
        })
    }, [])



    return (
        <ReplyWrapper className='container'>
            <h2 className='replyTitle'>댓글</h2>
            <form onSubmit={onSubmit}>
                <div className='replyArea'>
                    {/* <img src={user.photoURL} alt={user.displayName} /> */}
                    <div>
                        {/* <span>{user.displayName}</span> */}
                        <input
                            type="text"
                            placeholder='내용을 입력하세요.'
                            onChange={onChange}
                            value={reply}
                        />
                    </div>
                    <button>
                        {isLoading ? '업로드 중' : '등록'}
                    </button>
                </div>
            </form>
        </ReplyWrapper>
    );
}

export default Replies;

const ReplyWrapper = styled.div`

    .replyTitle{

    }
    img{
        width: 40px;
        height: 40px;
        border-radius: 100%;
    }
`