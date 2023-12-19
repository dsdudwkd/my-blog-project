import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from 'styled-components';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { formats, modules } from '../api/QuillEditor';
import { auth, db, storage } from '../api/firebase';
import { ref } from 'firebase/database';
import { getDownloadURL, uploadBytes} from 'firebase/storage';
import DOMPurify from "isomorphic-dompurify"

const NewPost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    const [file, setFile] = useState(null);
    const [docRef, setDocRef] = useState(null);
    const user = auth.currentUser;
    const quillRef = useRef(null);


    const writeTitle = (e) => {
        setTitle(e.target.value);
    };

    const writePost = (content) => {
        setPost(content);
        
    };

    const imageHandler = (content) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.addEventListener("change", async () => {
            const editor = quillRef.current.getEditor();
            const file = input.files[0];
            const range = editor.getSelection(true);
            try {
                // 파일명을 "image/Date.now()"로 저장
                const storageRef = ref(
                    storage,
                    `posts/${user.uid}-${user.displayName}/${doc.id}`
                );
                console.log(storageRef)
                // Firebase Method : uploadBytes, getDownloadURL
                await uploadBytes(storageRef, file).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((url) => {
                        // 이미지 URL 에디터에 삽입
                        editor.insertEmbed(range.index, "image", url);
                        // URL 삽입 후 커서를 이미지 뒷 칸으로 이동
                        editor.setSelection(range.index + 1);
                    });
                });
            } catch (error) {
                console.log(error);
            }
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // const user = auth.currentUser;

        if (!user || isLoading || title === '' || post === '') return;
        try {
            setIsLoading(true);
            

            const newDocRef = await addDoc(collection(db, 'posts'), {
                title,
                post,
                createdAt: Date.now(),
                userId: user.uid
            });

            setDocRef(newDocRef);

            // if (file) {
            //     const editor = quillRef.current.getEditor();
            //     const range = editor.getSelection(true);
            //     const locationRef = ref(storage, `posts/${user.uid}-${user.displayName}/${doc.id}`);
            //     const result = await uploadBytes(locationRef, file);
            //     const url = await getDownloadURL(result.ref);

            //     await updateDoc(doc, {
            //         photo: url
            //     });
            // }
            imageHandler()
            console.log(post);
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

                    <div>
                        <ReactQuill
                            ref={quillRef}
                            style={{ height: "600px" }}
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            preserveWhitespace
                            value={post}
                            onChange={writePost}
                        />
                    </div>
                    {/* <div
                        className="view ql-editor" // react-quill css
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post),
                        }}
                    /> */}

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