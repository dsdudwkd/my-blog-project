import { collection, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { auth, db } from '../api/firebase';
import SideBar from '../components/SideBar';
import DOMPurify from 'dompurify';
import { CiMenuKebab } from "react-icons/ci";
import Replies from '../components/Replies';

function PostDetails() {
    const post = useLocation().state;
    const [show, setShow] = useState(false);
    const user = auth.currentUser;
    const navigate = useNavigate();
    // console.log(post.id)
    // console.log(user.uid);

    const backgroundStyle = {
        background: post.photoURL ? `#cccccc url(${post.photoURL}) no-repeat center / cover` : '#666',
    };

    const handleBtn = () => {
        const btns = document.querySelectorAll('.btns');
        btns.forEach(el => (el.style.display = show ? 'none' : 'flex')); // 토글 형식으로 show 상태 변경
        setShow(!show);
    };

    const deletePost = async (postId) => {
        const deleteDocs = await deleteDoc(doc(db, 'post', user.uid));

        alert('정말로 삭제하시겠습니까?');
        navigate('/');
    }

    return (

        <DetailsWrapper >
            {/* style={{background:`url(${post.photoURL}) no-repeat center / cover`}} react에서 inline으로 백그라운드 넣는 법 */}
            <Title className='title' style={backgroundStyle}>
                <h2>{post.title}</h2>
                <div>
                    <span>{post.userName}</span>
                    <span>{post.createdAt}</span>
                    <CiMenuKebab className='svg' onClick={handleBtn} />

                </div>
            </Title>
            <Container className='container'>
                <SideBar />
                <Post >
                    <p dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.post)
                    }} />

                <Replies post={post.id} />{/* 문서 id 값 전달 */}
                </Post>
                <Button className='btns'>
                    <button>수정</button>
                    <button onClick={deletePost}>삭제</button>
                </Button>
            </Container>
        </DetailsWrapper>
    );
}

export default PostDetails;

const DetailsWrapper = styled.div`
    overflow: hidden;
`
const Title = styled.div`
    padding: 100px 50px 50px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    font-family: Noto Sans KR;
    text-align: left;
    box-sizing: border-box;
    h2{
        font-size: 34px;
        color: #fff;
    }
    div{
        display: flex;
        align-items: center;
        gap: 20px;
        color: #fbfbfb;
        font-size: 14px;
        svg{
            width: 14px;
            height: 14px;
            color: #fff;
            border: 1px solid #fff;
            border-radius: 100%;
            padding: 2px;
            position: relative;
           
        }
    }
`

const Container = styled.div`
`

const Post = styled.div`
    float: right;
    width: calc(100% - (21.296296296296296%));
    padding: 72px 60px;
    box-sizing: border-box;
    img{
        width: 300px;
        height: 300px;
        margin: 0 auto;
    }
`

const Button = styled.div`
    width: 100px;
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 10px 0;
    position: absolute;
    top: 370px;
    left: 210px;
    border: 1px solid #ECECEC;
    border-radius: 4px;
    background-color: #fff;
    z-index: 9;
    text-align: center;
    button{
        border: none;
        background-color: #fff;
        padding: 6px 12px;
        &:hover{
            background-color: #f6f6f6;
        }
    }
    
    
`

