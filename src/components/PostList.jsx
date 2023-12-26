import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PostItem from './Post';
import { db, getPosts } from '../api/firebase';
import DOMPurify from 'dompurify';
import Post from './Post';
import styled from 'styled-components';
import CategoryList from './CategoryList';
import SideBar from './SideBar';
import PostDetails from '../pages/PostDetails';
import DetailPageEvent from './DetailPageEvent';
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

    const details = () => {
        navigate(`products/detail/${posts.id}`, {
            state: {
                id: posts.id,
                title: posts.title,
                post: posts.post,
                photoURL: posts.photoURL,
                createdAt: posts.createdAt,
            }
        })
    }

    return (
        <PostWrapper className='container'>
            {/* {JSON.stringify(posts)}; */}
            <SideBar />

            <Content>
                {posts.slice(0, 8).map((post) => ( //최대 8개까지만 보이고, 글이 개별적으로 보이게
                    <ContentList key={post.id} onClick={details}>
                        <Title dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }} />
                        <Datails dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post.post,
                                {
                                    ALLOWED_TAGS: ['p', 'em', 'span'] //p, em, span 태그만 보이게
                                })
                        }} />
                        <PublishedDate dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.createdAt.substring(0, 10))/* 시간을 제외한 날짜만 보이게 */ }} />
                    </ContentList>
                ))}
            </Content>
        </PostWrapper>
    );
}

export default PostList;

const PostWrapper = styled.div`
    width: 1080px;
    overflow: hidden;
`

const Content = styled.ul`
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
    padding: 20px 40px;
    font-family: Noto Sans KR;
    /* span{
        height: 80px;
    } */
`

const Title = styled.h2`
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 6px;
    color: #555;
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