import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { auth, db } from '../api/firebase';
import { VscKebabVertical } from "react-icons/vsc";

function ReplyList(post) {

    const [replies, setReplies] = useState([]);
    const [open, setOpen] = useState(false);
    const postID = post.postId;
    const user = auth.currentUser;

    useEffect(() => {
        let unSubscribe = null;
        const fetchReplies = async () => {
            const replyQuery = query(
                collection(db, 'posts', postID, 'replies'),
                orderBy('createdAt'),
            )

            unSubscribe = await onSnapshot((replyQuery), (snapshot) => {
                const replyArr = snapshot.docs.map((doc) => {
                    const { reply, createdAt, userId, userName, userImage } = doc.data();
                    // console.log(doc.data());
                    return {
                        reply,
                        createdAt,
                        userId,
                        userName,
                        userImage,
                        id: doc.id
                    }
                })
                setReplies(replyArr);
            })
        }
        fetchReplies();
        return () => {
            if (unSubscribe) unSubscribe();
        }
    }, []);

    // 삭제 이벤트
    const deleteReply = async (replyId) => {
        const ok = window.confirm('정말로 삭제하시겠습니까?');
        const replyID = replies.find((el) => el.id === replyId);
        // console.log(replyID)
        // console.log(replyId)

        if (!ok || user.uid !== replyID.userId) return;
        try {
            await deleteDoc(doc(db, 'posts', postID, 'replies', replyID.id)); //문서의 id로 삭제
        } catch (error) {
            console.error(error);
        }

    };

    //수정 삭제 버튼 박스 토글 형식으로 + 해당 댓글에만
    const handleButton = (event) => {

        const replyArea = event.currentTarget.closest('.replyArea');
        const buttons = replyArea.querySelector('.buttons');
        console.log(replyArea)
        if (buttons) {
            buttons.style.display = open ? 'none' : 'flex';
            setOpen(!open);
        }
        // event.stopPropagation(); // 이벤트가 부모 요소로 전파되지 않도록 방지
    };

    return (
        <RepliesWrapper className='container'>
            <RepliesList className='RepliesList'>
                <>
                    {replies.map((reply) => (
                        <div key={reply.id} className='replyArea'>
                            <div className='inner'>
                                <div className='img'>
                                    {reply.userImage ? (<img src={reply.userImage} alt={reply.userName} />) : ('')}
                                </div>
                                <div className='title'>
                                    <span >{reply.userName}</span>
                                    <VscKebabVertical className='svg' onClick={(e)=>{handleButton(e)}} />
                                </div>
                            </div>
                            <div>
                                <p className='content' >{reply.reply}</p>
                            </div>
                            <div className='buttons'>
                                <button>
                                    수정
                                </button>
                                <button onClick={() => { deleteReply(reply.id) }}>삭제</button>
                            </div>
                        </div>


                    ))}
                </>
            </RepliesList>

        </RepliesWrapper>
    );
}

export default ReplyList;

const RepliesWrapper = styled.div`
    
`

const RepliesList = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    position: relative;
    .replyArea{
        display: flex;
        flex-direction: column;
        gap: 0;
        border-bottom: 1px solid #dedede;
        padding: 20px 0;
        width: 100%;
        .inner{
            display: flex;
            gap: 10px;
            height: 30px;
            img{
                width: 40px;
                height: 40px;
                border-radius: 100%;
            }
            .title{
                width: 100%;
                display: flex;
                justify-content: space-between;
                font-weight: 600;
                .svg{
                    cursor: pointer;
                }
            }
        }
        .content{
            display: block;
            box-sizing: border-box;
            /* width: 100%; */
            white-space: pre-line; //개행문자 처리 https://velog.io/@stakbucks/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%AC%B8%EC%9E%90%EC%97%B4-%EC%B6%9C%EB%A0%A5-n-%EC%A4%84%EB%B0%94%EA%BF%88-%ECEC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0 참조
            word-break: break-all;
            margin-left: 50px;
            line-height: 1.3;
            font-size: 14px;
        }
        .buttons{
            width: 100px;
            display: none;
            flex-direction: column;
            gap: 5px;
            padding: 10px 0;
            position: absolute;
            top: 40px;
            left: calc(100% - 60px);
            border: 1px solid #ECECEC;
            border-radius: 4px;
            background-color: #fff;
            z-index: 99;
            text-align: center;
            button{
                border: none;
                background-color: #fff;
                padding: 6px 12px;
                &:hover{
                    background-color: #f6f6f6;
                }
            }
        }
    }
`