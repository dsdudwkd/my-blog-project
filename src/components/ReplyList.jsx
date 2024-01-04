import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../api/firebase';

function ReplyList(post) {

    const [replies, setReplies] = useState([]);
    const postID = post.postId;

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
                    console.log(doc.data());
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
    }, [])
    return (
        <RepliesWrapper className='container'>
            <RepliesList>
                {replies.map((reply) => (
                    <div key={reply.id} className='replyArea'>
                        {reply.userImage ? (<img src={reply.userImage} alt={reply.userName} />) : ('')}
                        <div>
                            <span>{reply.userName}</span>
                            <p className='content'>
                                {reply.reply}
                            </p>
                        </div>

                    </div>
                ))}
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
    .replyArea{
        display: flex;
        img{
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }
    }
`