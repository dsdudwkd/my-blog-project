import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from 'styled-components';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { formats, modules } from '../api/QuillEditor';
import { auth, db, storage } from '../api/firebase';
import { ref } from 'firebase/database';
import { getDownloadURL, uploadBytes } from 'firebase/storage';

function NewPost() {
    // const [quillValue, setQuillValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    const [file, setFile] = useState(null);
    const quillRef = useRef(null);


    const writeTitle = (e) => {
        setTitle(e.target.value);
    }
    // const writePost = (e) => {
    //     setPost(e.target.value);
    // }

    const writePost = (content) => {
        setPost(content);
    };

    // const insertFile = (event) => {
    //     const { files } = event.target;
    // if (files && files[0]) { //파일이 존재하고 하나 이상의 파일을 선택했는지
    //     setFile(files[0]);
    // } 
    // }

    useEffect(()=>{
        const insertImg = () => {
            const input = document.createElement('input');
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();
            input.onchange = async () => {
                const file = input.files[0];
                const range = getEditor().getSelection(true);
                getEditor().insertEmbed(range.index, "image", "images/loading.gif")
                try {
                    // 필자는 파이어 스토어에 저장하기 때문에 이런식으로 유틸함수를 따로 만들어줬다 
                    // 이런식으로 서버에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현하면 된다 
                    const filePath = `contents/temp/${Date.now()}`;
                    const url = await uploadImage(file, filePath); 
                    
                    // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
                    getEditor().deleteText(range.index, 1);
                    // 받아온 url을 이미지 태그에 삽입
                    getEditor().insertEmbed(range.index, "image", url);
                    
                    // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
                    getEditor().setSelection(range.index + 1);
                  } catch (e) {
                    getEditor().deleteText(range.index, 1);
                  }
            }
        }
        if(quillRef.current){
            const {getEditor} = quillRef.current;
            const toolbar = quillRef.current.getEditor().getModule("toolbar");
            
        }
    })

    const onChange = (e) => {
        writePost(e);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;

        if (!user || isLoading || title === '' || post === '') return;
        try {
            setIsLoading(true);

            const doc = await addDoc(collection(db, 'posts'), {
                title,
                post,
                createdAt: Date.now(),
                userId: user.uid
            })
            //파일이 있다면(파일 첨부했다면)
            if (file) {
                //user가 업로드한 파일 storage의 폴더(document)생성
                const locationRef = ref(storage, `posts/${user.uid}-${user.displayName}/${doc.id}`)
                //위의 경로에 파일을 넣는다
                const result = await uploadBytes(locationRef, file);
                const url = getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url
                })
            }
            setPost('');
            setTitle('');
            setFile(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);

        }
    }


    return (
        <PostWrapper>
            <div className='container'>
                <form onSubmit={onSubmit}>

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
                    {/* <div className='postContainer'>
                        <textarea
                            name="main"
                            id="write-post"
                            value={post}
                            onChange={writePost}
                        />
                    </div> */}

                    <ReactQuill
                    ref={quillRef}
                        style={{ height: "600px" }}
                        theme="snow"
                        modules={{
                            ...modules,
                            imageResize: {
                                parchment:Quill.import("parchment"),
                                modules: ["Resize", "DisplaySize", "Toolbar"],
                            },
                        }}
                        formats={formats}
                        preserveWhitespace
                        value={post}
                        onChange={onChange}
                     />

                    <button type='submit' className='submitBtn'>
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
            .submitBtn{
                margin: 80px auto 0;
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