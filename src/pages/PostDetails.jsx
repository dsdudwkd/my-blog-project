import { collection, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { auth, db, onUserState, storage } from '../api/firebase';
import SideBar from '../components/SideBar';
import DOMPurify from 'dompurify';
import { VscKebabVertical } from "react-icons/vsc";
import Replies from '../components/WriteReply';
import { deleteObject, ref } from 'firebase/storage';
import EditPost from './EditPost';
import WriteReply from '../components/WriteReply';

function PostDetails() {
    const post = useLocation().state;
    const [show, setShow] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        onUserState((user) => {
            setUser(user);
        })
    }, [])

    if (!user) {
        // 사용자 데이터가 로딩 중인 경우나 user 정보가 없을 때
        return <div>로딩 중...</div>;
    }
    // console.log(user);
    // console.log(post.id);
    // console.log(post);
    const backgroundStyle = {
        background: post.mainPhotoURL ? `#cccccc url(${post.mainPhotoURL}) no-repeat center / cover` : '#666',
    };

    //수정 삭제 버튼 박스 토글 형식으로 
    const handleBtn = () => {
        const btns = document.querySelectorAll('.btns');
        btns.forEach(el => (el.style.display = show ? 'none' : 'flex')); // 토글 형식으로 show 상태 변경
        setShow(!show);
    };

    // 삭제 이벤트
    const deletePost = async () => {
        const ok = window.confirm('정말로 삭제하시겠습니까?'); //Unexpected use of 'confirm'" 오류 해결 = 바로 confirm 메서드 말고 window.confirm으로 작성

        if (!ok || user.uid !== post.userId) return;

        try {
            await deleteDoc(doc(db, 'posts', post.id)); //문서의 id로 삭제
            if (post.mainPhotoURL) {
                const photoRef = ref(storage, `post/${user.uid}/${post.id}`);
                await deleteObject(photoRef);
            }

            navigate('/');
        } catch (error) {
            console.error(error);
        }

    }

    return (

        <DetailsWrapper >
            {/* style={{background:`url(${post.photoURL}) no-repeat center / cover`}} react에서 inline으로 백그라운드 넣는 법 */}
            <Title className='title' style={backgroundStyle}>
                <h2>{post.title}</h2>
                <div>
                    <span>{post.userName}</span>
                    <span>{post.createdAt}</span>
                    {user.uid === post.userId ? //작성자가 아닌 경우엔 이 버튼이 보이지 않게
                        <VscKebabVertical className='svg' onClick={handleBtn} /> : null
                    }
                </div>
            </Title>
            <Container className='container'>
                <SideBar />
                <Post >
                    <p dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.post)
                    }} />

                    <WriteReply postId={post.id} />{/* 문서 id 값 전달 */}
                </Post>
                <Button className='btns'>
                    <button>
                        수정
                        <EditPost />
                    </button>
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
        gap: 16px;
        color: #fbfbfb;
        font-size: 14px;
        svg{
            width: 16px;
            height: 16px;
            color: #fff;
            border: 1px solid #fff;
            border-radius: 100%;
            padding: 2px;
            cursor: pointer;
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
    top: 300px;
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

