import React, { useEffect, useState } from 'react';
import UserData from './UserData';
import { onUserState, auth, db } from '../api/firebase';
import { addDoc, collection, doc, documentId, getDoc, getFirestore, query, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import styled from 'styled-components';
import ReplyList from './ReplyList';
import { useNavigate } from 'react-router-dom';

function WriteReply(postID) {

    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [reply, setReply] = useState('');
    const [hover, setHover] = useState(false);

    const user = auth.currentUser;
    const postId = postID.postId;
    const navigate = useNavigate();

    const onChange = (e) => {
        setReply(e.target.value);
    }

    //댓글 textarea부분 크기 늘이기 (https://stickode.tistory.com/538 참조)
    const onInput = () => {
        const text = document.querySelector('textarea');
        text.style.height = 50 + 'px';
        text.style.height = text.scrollHeight + 'px';
    }

    const onMouseEnter = () => {
        setHover(true);
    }
    const onMouseLeave = () => {
        setHover(false);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!user || reply === '' || isLoading) return;

        try {
            setIsLoading(true);
            //글(문서) Id 

            // console.log(postId)
            //해당 글에 대한 댓글 작성을 위해 하위 컬렉션 생성
            const repliesRef = collection(db, 'posts', postId, 'replies');
            //한국 시간 설정(9시간 차이 나므로)
            const kr_time = 1000 * 60 * 60 * 9;
            // 댓글 데이터 작성
            await addDoc(repliesRef, {
                reply,
                userName: user.displayName || '익명',
                userImage: user.photoURL || '',
                userId: user.uid,
                createdAt: new Date((new Date()).getTime() + kr_time).toISOString().replace('T', ' ').substring(0, 16),
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
            <ReplyList postId={postId} />
            <form onSubmit={onSubmit}>
                <div className='writeReplyArea'>
                    {user && user.photoURL ? <img src={user.photoURL} alt={user.displayName} /> : ''}
                    <div className='reply'>
                        {user && user.displayName ? <span>{user.displayName}</span> : ''}
                        {user ?
                            <textarea
                                placeholder='내용을 입력하세요.'
                                onChange={onChange}
                                onInput={onInput}
                                style={{ whiteSpace: 'pre-line' }}
                                value={reply}
                            /> :
                            <textarea
                                placeholder='로그인 후 댓글을 작성할 수 있습니다.'
                                onClick={()=>{navigate('/login')}}
                                style={{cursor: 'pointer'}}
                            />
                        }
                    </div>
                </div>
                <>
                    {reply.length < 1 ?
                        (<button disabled style={{ cursor: 'not-allowed', border: '1px solid #dedede' }}  >
                            등록
                        </button>) :
                        (<button className={hover ? 'colorChange' : 'basic'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
                            {isLoading ? '업로드 중' : '등록'}
                        </button>)
                    }
                </>

            </form>
        </ReplyWrapper>
    );
}

export default WriteReply;

const ReplyWrapper = styled.div`
    
    .replyTitle{
        margin-top: 300px;
        margin-bottom: 10px;
        padding-bottom: 20px;
        color: #444;
        border-bottom: 1px solid #dedede;
    }
    .writeReplyArea{
        display: flex;
        gap: 10px;
        font-family: Noto Sans KR;
        img {
            margin: 0;
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }
        .reply{
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 15px;
            border: 1px solid #888;
            border-radius: 8px;
            padding: 12px;
            box-sizing: border-box;
            span{
                font-weight: 600;
            }
            textarea{
                width: 100%;
                max-height: 300px;
                border: none;
                font-size: 14px;
                font-family: Noto Sans KR;
                resize: none;
                overflow-y: auto;
                &:focus{
                    outline: none;
                }
                &::placeholder{
                    font-family: Noto Sans KR;
                }
            }
        }
        
    }
    button{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: auto; //우측 정렬 https://oneroomtable.com/entry/flex-%EC%86%8D%EC%84%B1-%EC%82%AC%EC%9A%A9-%EB%B0%A9%EB%B2%95-%EC%A2%8C%EC%B8%A1-%EC%9A%B0%EC%B8%A1-%EC%A4%91%EC%95%99-%EC%A0%95%EB%A0%AC-%EB%93%B1 참조
            margin-top: 10px;
            width: 100px;
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            font-family: Noto Sans KR;
            font-size: 16px;
        }
        .basic{
            background-color: black;
            color: #fff;
        }
        .colorChange{
            background-color: #49633a;
            color: #fff;
        }
    
    
`