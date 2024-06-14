import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../api/firebase';
import DOMPurify from 'dompurify';
import styled from 'styled-components';

function AllPosts(props) {


    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let unsubscribe = null;
        const fetchPosts = async () => {
            const postQuery = query(
                collection(db, 'posts'),
                orderBy("createdAt", "desc"),
            );
            //더 이상 데이터를 리슨할 필요가 없으면 이벤트 콜백이 호출되지 않도록 리스너를 분리해야 함(비용 지불 되기 때문)
            unsubscribe = await onSnapshot((postQuery), (snapshot) => {
                const postArr = snapshot.docs.map((doc) => {
                    const { title, post, createdAt, userId, userName, mainPhotoURL } = doc.data();
                    return {
                        title,
                        post,
                        createdAt,
                        userId,
                        userName,
                        mainPhotoURL,
                        id: doc.id,
                    }
                })
                setPosts(postArr)
            })
        }
        fetchPosts();
        return () => {
            //useEffect의 cleanup 기능을 이용하여 이 컴포넌트가 사용되지 않을 때(unmount일 때) unsubscribe 함수 호출
            //ex) 유저가 로그아웃 되었거나, 다른 화면에 있을 때
            if (unsubscribe) unsubscribe();
        }
    }, []);

    const details = (postId) => {
        const post = posts.find((p) => p.id === postId);

        if (post) {
            navigate(`posts/detail/${post.id}`, {
                state: { ...post }
            })
        }
    } 


    return (
        <div>
            {posts.map((post) => (
                <div onClick={details} className='postsItem'>
                    {post.mainPhotoURL ? <img src={post.mainPhotoURL} alt={`${post.title}의 대표 이미지`} /> : <div className='no-image'><span>No Image</span></div>}
                    <h3 className='itemTitle'>{post.title}</h3>
                    <p dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.post,
                            {
                                ALLOWED_TAGS: ['p', 'em', 'span'], //p, em, span 태그만 보이게
                                ALLOWED_ATTR: { span: ["style"], p: ["style"], em: ["style"] } //p, em, span 태그에 style 적용되게끔
                            })
                    }} />
                    <p className='postDate'>{post.createdAt}</p>
                </div>
            ))}
        </div>
    );
}

export default AllPosts;

