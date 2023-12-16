import { getAuth } from 'firebase/auth';
import { refFromURL } from 'firebase/database';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import Replies from '../components/Replies';
import { auth, db } from '../api/firebase';
import QuillEditor from '../api/QuillEditor';


function NewPost(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    

    const writeTitle = (e) => {
        setTitle(e.target.value);
    }
    const writePost = (event) => {
        setPost(event.target.value);
    }
    

    const onSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;

        if(!user || isLoading || title === '' || post === '') return;
        try{
            setIsLoading(true);
            
            await addDoc(collection(db, 'posts'), {
                title,
                post,
                createdAt: Date.now(),
                userId: user.uid
            })
        }catch(error){
            console.error(error);
        }finally{
            setIsLoading(false);
            setPost('');
            setTitle('');
        }
    }

    return (
        <PostWrapper>
            <div className='container'>
                <form onSubmit={onSubmit}>
                    <div className='quillAPI'>
                        <QuillEditor />
                    </div>
                    <div className='select-category'>
                        {/* <label htmlFor="choose-category">카테고리</label> */}
                        <select name="choose-category" id="choose-category" placeholder='카테고리'>
                            <option value="categoryList" id="choose-category">카테고리</option>
                            <option value="categoryList" id="choose-category">카테고리 없음</option>
                        </select>
                    </div>
                    <div className='postTitle'>
                        <textarea
                            name="title"
                            id="post-title"
                            // maxLength={180}
                            placeholder='제목을 입력하세요'
                            value={title}
                            onChange={writeTitle}
                        />
                    </div>
                    <div className='postContainer'>
                        <textarea
                            name="main"
                            id="write-post"
                            value={post}
                            onChange={writePost}
                        />
                    </div>
                    <button type='submit'>
                        {isLoading ? '업로드 중..' : '완료'}
                    </button>
                </form>
                
            </div>
        </PostWrapper>
    );
}

export default NewPost;

const PostWrapper = styled.div`
    /* overflow-y: scroll; */
    .container{
        
        padding: 40px 0;
        form{
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 1080px;
            margin: 0 auto;
            textarea{
                width: 100%;
                border: none;
                resize: none;
                &#post-title{
                    width: 100%;
                    height: 42px;
                    font-size: 30px;
                    padding: 20px 0;
                    border-bottom: 1px solid #e4e3e3;
                }
                &#write-post{
                    height: 500px;
                }
            }
            button{
                margin: 0 auto;
                padding: 8px 24px;
                width: 250px;
                color: #fff;
                background-color: black;
                font-size: 18px;
                font-family: Noto Sans KR;
                border: none;
                border-radius: 16px;
            }
        
        }
        
    }
`