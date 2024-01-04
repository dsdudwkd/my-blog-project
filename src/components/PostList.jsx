import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../api/firebase';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import SideBar from './SideBar';
import { useNavigate } from 'react-router-dom';


function PostList(props) {

    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let unsubscribe = null; 
        const fetchPosts = async () => {
            const postQuery = query(
                collection(db, 'posts'),
                orderBy("createdAt", "desc"),
                limit(8) //글을 전부 읽고 불러오는 대신 갯수를 한정지어 그 갯수만큼만 불러오기 => 비용 절약할 수 있음 & slice(0, 8) 대신 사용 가능
            );
            //더 이상 데이터를 리슨할 필요가 없으면 이벤트 콜백이 호출되지 않도록 리스너를 분리해야 함(비용 지불 되기 때문)
            unsubscribe = await onSnapshot((postQuery), (snapshot) =>{
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
            if(unsubscribe) unsubscribe(); 
        }
    }, []);

    const details = (postId) => {
        const post = posts.find((p) => p.id === postId);

        if(post){
            navigate(`posts/detail/${post.id}`, {
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
                        <Details dangerouslySetInnerHTML={{
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
`

const Title = styled.h2`
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 6px;
    color: #555;
    ${ContentList}:hover & { //ContentList의 컴포넌트에 mouseover하면 현재 컴포넌트에 효과를 준다는 의미
        text-decoration-line: underline;
    }
    
`

const Details = styled.span`
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