import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { admin, auth, db, onUserState } from '../api/firebase';
import { VscKebabVertical } from "react-icons/vsc";

function ReplyList(post) {

    const [replies, setReplies] = useState([]);
    const [user, setUser] = useState('');
    const [edit, setEdit] = useState('');
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const postID = post.postId;
    const currentUser = auth.currentUser;
    // const admin = user.isAdmin;
    // console.log(admin);
    useEffect(() => {
        onUserState((user) => {
            setUser(user);
        })
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

        if (!ok || currentUser.uid !== replyID.userId) return;
        try {
            await deleteDoc(doc(db, 'posts', postID, 'replies', replyID.id)); //문서의 id로 삭제
        } catch (error) {
            console.error(error);
        }

    };
    
    //외부 클릭하면 btns 영역 사라지게
    const handleBodyClick = (e) => {
        const btns = document.querySelectorAll('.btns');
    
        if (!Array.from(btns).some(btn => btn.contains(e.target))) {
            btns.forEach(btn => {
                btn.style.display = 'none';
            });
            document.body.removeEventListener('click', handleBodyClick);
        }
    };

    //수정 삭제 버튼 박스 토글 형식으로 + 해당 댓글에만
    const handleButton = (event) => {
        const replyArea = event.currentTarget.closest('.replyArea');
        const btns = replyArea.querySelector('.btns');

        if (btns) {
            document.querySelectorAll('.btns').forEach(otherBtns => {
                otherBtns.style.display = 'none';
            });
            btns.style.display = show ? 'none' : 'flex';
            setShow(!show);
        }
        document.body.addEventListener('click', handleBodyClick);
        event.stopPropagation(); // 이벤트가 부모 요소로 전파되지 않도록 방지
    };

    //수정 버튼 누르면 editArea 부분 보이게
    const changeEditForm = (e) => {
        //e.currentTarget.parentElement.parentElement = replyArea
        e.currentTarget.parentElement.parentElement.style.display = 'none';
        //e.currentTarget.parentElement.parentElement.nextSibling = editArea
        e.currentTarget.parentElement.parentElement.nextSibling.style.display = 'flex';
    }

    //취소 버튼 누르면 editArea 사라지게
    const cancelEdit = (e) => {
        //e.currentTarget.parentElement.parentElement = editArea
        e.currentTarget.parentElement.parentElement.style.display = 'none';
        //e.currentTarget.parentElement.parentElement.previousSibling = replyArea
        e.currentTarget.parentElement.parentElement.previousSibling.style.display = 'flex';
    }

    //수정 이벤트
    const editReply = (e, replyId) => {
        const replyInfo = replies.find((el) => el.id === replyId);
        // console.log(replyInfo)
        const changeReply = e.target.value;
        // console.log(changeReply)
        replyInfo.reply = changeReply;
        setEdit(changeReply);
    }

    //댓글 textarea부분 크기 늘이기 (https://stickode.tistory.com/538 참조)
    const onInput = () => {
        const text = document.querySelector('textarea');
        text.style.height = 50 + 'px';
        text.style.height = text.scrollHeight + 'px';
    }

    const onSubmit = async (e, replyId) => {
        e.preventDefault();
        const replyID = replies.find((el) => el.id === replyId);
        
        if (!currentUser || edit === '' || isLoading) return;
        try {
            setIsLoading(true)
            const updateDocRef = doc(db, 'posts', postID, 'replies', replyID.id);
            await setDoc(updateDocRef, {
                createdAt: replyID.createdAt,
                reply: replyID.reply || edit,
                userId: replyID.userId,
                userImage: replyID.userImage,
                userName: replyID.userName
            })
        } catch (error) {
            console.error(error);
        } finally{
            setIsLoading(false);
        }
    }

    const onMouseEnter = () => {
        setHover(true);
    }
    const onMouseLeave = () => {
        setHover(false);
    }

    return (
        <RepliesWrapper className='container'>
            <RepliesList className='RepliesList'>
                <>
                    {replies.map((reply) => (
                        <li key={reply.id} >
                            <div className='replyArea'>
                                <div className='inner'>
                                    <div className='img'>
                                        {reply.userImage ? (<img src={reply.userImage} alt={reply.userName} />) : (<div className='nonImg'>{reply.userName}</div>)}
                                    </div>
                                    <div className='title'>
                                        <span >{reply.userName}</span>
                                        <VscKebabVertical className='svg' onClick={(e) => { handleButton(e) }} />
                                    </div>
                                </div>
                                <div>
                                    <p className='content' >{reply.reply}</p>
                                </div>
                                <div>
                                    <p className='writedDate'>{reply.createdAt}</p>
                                </div>
                                <div className='btns'>
                                    {user && user.isAdmin && user.uid !== reply.userId && (
                                        <button onClick={() => deleteReply(reply.id)}>삭제</button>
                                    )}
                                    {user && user.uid === reply.userId && (
                                        <>
                                            <button className='editBtn' onClick={changeEditForm}>수정</button>
                                            <button onClick={() => deleteReply(reply.id)}>삭제</button>
                                        </>
                                    )}
                                    {(!user || user.uid !== reply.userId) && (
                                        <button>신고하기</button>
                                    )}
                                </div>
                            </div>
                            
                            {/* 수정하기 form */}
                            <form className='editArea' onSubmit={(e)=>{onSubmit(e, reply.id)}} style={{ display: 'none' }}>
                                <div className='inner'>
                                    <div className='img'>
                                        {reply.userImage ? (<img src={reply.userImage} alt={reply.userName} />) : ('')}
                                    </div>
                                    <div className='title'>
                                        <span >{reply.userName}</span>
                                    </div>
                                </div>
                                <div>
                                    <textarea
                                        className='content'
                                        value={reply.reply}
                                        onChange={(event) => { editReply(event, reply.id)}}
                                    />
                                </div>
                                <div className='editBtns'>
                                    <button className='cancelEdit' onClick={cancelEdit}>취소</button>
                                    <button className='submitEdit'>등록</button>
                                </div>
                            </form>
                        </li>
                    ))}
                </>
            </RepliesList>
        </RepliesWrapper>
    );
}

export default ReplyList;

const RepliesWrapper = styled.div`
`

const RepliesList = styled.ul`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    .replyArea,.editArea{
        position: relative;
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
            .img{
                .nonImg{
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                    background-color: coral;
                    color: #fff;
                    text-align: center;
                    font-weight: 600;
                    /* font-size: 12px; */
                    line-height: 40px;
                }
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                }
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
            white-space: pre-line; //개행문자 처리 https://velog.io/@stakbucks/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%AC%B8%EC%9E%90%EC%97%B4-%EC%B6%9C%EB%A0%A5-n-%EC%A4%84%EB%B0%94%EA%BF%88-%ECEC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0 참조
            word-break: break-all;
            margin-left: 50px;
            line-height: 1.3;
            font-size: 14px;
            resize: none;
        }
        .writedDate{
            margin-top: 20px;
            box-sizing: border-box;
            white-space: pre-line; //개행문자 처리 https://velog.io/@stakbucks/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%AC%B8%EC%9E%90%EC%97%B4-%EC%B6%9C%EB%A0%A5-n-%EC%A4%84%EB%B0%94%EA%BF%88-%ECEC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0 참조
            word-break: break-all;
            margin-left: 50px;
            line-height: 1.3;
            font-size: 14px;
        }
        .btns{
            width: 100px;
            display: none;
            flex-direction: column;
            gap: 5px;
            /* padding: 10px 0; */
            position: absolute;
            top: 40px;
            right: -44px;
            border: 1px solid #ECECEC;
            border-radius: 4px;
            background-color: #fff;
            z-index: 99;
            button{
                border: none;
                background-color: #fff;
                margin: 0;
                padding: 6px 12px;
                text-align: right;
                &:hover{
                    background-color: #f6f6f6;
                }
            }
        }
        textarea{
            width: calc(100% - 50px);
            max-height: 300px;
            padding: 12px;
            border-radius: 8px;
            box-sizing: border-box;
        }
        .editBtns{
            position: relative;
            height: 44px;
            button{
                margin-top: 5px;
            }
            .submitEdit{
                position: absolute;
                top: 0;
                right: 105px;
                margin-left: 5px;
            }
            .cancelEdit{
                position: absolute;
                top: 0;
                right: 0px;
            }
            
        }
        
    }
`