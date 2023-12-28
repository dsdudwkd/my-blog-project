import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../api/firebase';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import SideBar from './SideBar';
import { useNavigate } from 'react-router-dom';


function PostList(props) {

    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        const postQuery = query(
            collection(db, 'posts'),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(postQuery);
        const postArr = snapshot.docs.map((doc) => {
            const { title, post, createdAt, userId, userName, photoURL } = doc.data();
            return {
                title,
                post,
                createdAt,
                userId,
                userName,
                photoURL,
                id: doc.id,
            }
        })
        setPosts(postArr)
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const details = (postId) => {
        const post = posts.find((p) => p.id === postId);

        if(post){
            navigate(`products/detail/${post.id}`, {
                state: {...post}
            })
        }
    }

    return (
        <PostWrapper className='container'>
            <SideBar />

            <ContentContainer>
                {posts.map((post) => ( //최대 8개까지만 보이고, 글이 개별적으로 보이게
                    <ContentList key={post.id} onClick={()=>{details(post.id)}}>
                        <Title className='title' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }} />
                        <Datails  dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post.post,
                                {
                                    ALLOWED_TAGS: ['p', 'em', 'span'] //p, em, span 태그만 보이게
                                })
                        }} />
                        <PublishedDate dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.createdAt.substring(0, 10))/* 시간을 제외한 날짜만 보이게 */ }} />
                    </ContentList>
                ))}
            </ContentContainer>
        </PostWrapper>
    );
}

export default PostList;

const PostWrapper = styled.div`
    width: 1080px;
    min-height: 1280px;
    overflow: hidden;
`

const ContentContainer = styled.ul`
    width: 68.518518518518519%;
    float: right;
    box-sizing: border-box;
    padding: 72px 0;
    display: flex;
    flex-direction:column;
    gap: 20px;
    
    `

const ContentList = styled.li`
    list-style: none;
    padding: 60px 30px;
    font-family: Noto Sans KR;
    cursor: pointer;
    &:hover {
        ${Title} {
            text-decoration-line: underline;
        }
    }
`

const Title = styled.h2`
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 6px;
    color: #555;
    &:hover{
        text-decoration-line: underline;
    }
    
`

const Datails = styled.span`
    max-width: 95%;
    overflow: hidden;
    font-size: 14px;
    color: #888;
    display: -webkit-box; 
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; //콘텐츠를 지정한 줄 수만큼으로 제한
    overflow: hidden;
    white-space: break-spaces;//연속된 공백을 적용
    text-overflow: ellipsis; //말줄임표
    margin-bottom: 10px;
    line-height: 25px;
    p{
        display: inline;
    }
`

const PublishedDate = styled.span`
    font-size: 12px;
    color: #888;
`