import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from 'styled-components';
import { addDoc, collection, doc, refEqual, setDoc, updateDoc } from 'firebase/firestore';
import { formats, modules } from '../api/QuillEditor';
import { auth, db, storage } from '../api/firebase';
import { getDownloadURL, uploadBytes, ref as storageRef, ref } from 'firebase/storage';
import { FaPlus } from "react-icons/fa";
import { DOMPurify } from 'dompurify';
import { useLocation, useNavigate } from 'react-router-dom';



const EditPost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    const [mainFile, setMainFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const user = auth.currentUser;
    const quillRef = useRef(null);
    const navigate = useNavigate();
    const postInfo = useLocation().state;


    // console.log(posts.title);
    const writeTitle = (e) => {
        const editTitle = e.target.value; //useState로 관리되는 상태를 직접 수정하면 리액트가 상태 업데이트를 감지하지 못할 수 있습니다. 
        postInfo.title = editTitle;
        setTitle(editTitle);

    };

    const writePost = (content) => {
        const editPostContent = content;  // Use the provided Delta object
        postInfo.post = editPostContent;  // Update the postInfo.post directly (optional)
        setPost(editPostContent);  // Update the state
    };

    useEffect(() => {
        const editor = quillRef.current.getEditor();
        editor.getModule('toolbar').addHandler('image', () => {
            imageHandler();
        })
    }, [])

    //quill Editor 이미지 첨부 시 이미지 처리 및 스토리지에 추가하는 함수
    const imageHandler = async () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.addEventListener("change", async () => {
            const editor = quillRef.current.getEditor();
            const file = input.files[0];
            const range = editor.getSelection(true);
            try {
                const fileSize = file.size;
                const maxSize = 1024 ** 2 - 89;
                const storagePath = `post/${user.uid}-${user.displayName}/${file.name}`;
                const fileRef = storageRef(storage, storagePath);
                const snapshot = await uploadBytes(fileRef, file);
                const url = await getDownloadURL(snapshot.ref)

                if (fileSize > maxSize) {
                    alert("업로드 가능한 최대 이미지 용량은 1MB입니다.");
                    return;
                }
                editor.insertEmbed(range.index, "image", url);
                editor.setSelection(range.index + 1);
            } catch (error) {
                console.log(error);
            }
        });
    };
    const onFileChange = (e) => {
        const { files } = e.target;
        postInfo.mainPhotoURL = files;
        const fileSize = files[0].size;
        const maxSize = 1024 * 1024 * 1;

        if (files && files.length === 1) {
            if (fileSize < maxSize) { //사진 1MB 용량만 첨부할 수 있도록 추가
                setMainFile(files[0]);
                const reader = new FileReader();

                reader.onload = () => {
                    setPreviewURL(reader.result);
                }
                if (mainFile) {
                    reader.readAsDataURL(files[0]);
                }
            } else {
                alert('업로드 가능한 최대 이미지 용량은 1MB입니다.');
                return;
            }

        }
    };


    const onSubmit = async (e) => {
        e.preventDefault();

        if (!user || isLoading) return;
        if (postInfo.title.trim() === "") {
            alert('제목을 입력해주세요.');
            return;
        } else if (postInfo.post.trim() === "") {
            alert("본문을 입력해주세요.");
            return;
        }
        try {
            setIsLoading(true);
            const updateDocRef = doc(db, 'posts', `${postInfo.id}`);

            await setDoc(updateDocRef, {
                title: postInfo.title || title,
                post: postInfo.post || post,
                createdAt: postInfo.createdAt,
                userId: user.uid,
                userName: user.displayName || "익명"
            });
            if (mainFile) {
                const locationRef = ref(storage, `post/${user.uid}/${postInfo.id}`)
                const snapShot = await uploadBytes(locationRef, mainFile);
                const url = await getDownloadURL(snapShot.ref);

                await updateDoc(updateDocRef, {
                    mainPhotoURL: url
                })
            } else{
                await setDoc(updateDocRef, {
                    title: postInfo.title || title,
                    post: postInfo.post || post,
                    createdAt: postInfo.createdAt,
                    userId: user.uid,
                    userName: user.displayName || "익명",
                    mainPhotoURL: postInfo.mainPhotoURL || mainFile
                });
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            navigate('/');
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
                            placeholder='제목을 입력해주세요.'
                            value={postInfo.title}
                            onChange={writeTitle}
                        />
                        <div>
                            <label htmlFor="representitiveImg">
                                {mainFile && mainFile.type.startsWith('image/') ? (
                                    <>
                                        <img src={URL.createObjectURL(mainFile)} alt="이미지 미리보기" value="다시 선택" style={{ width: '100px', height: '100px', padding: '0', marginBottom: ' 5px' }} />
                                        (이미지 미리보기)
                                    </>
                                ) : (
                                    // 대표 사진이 있다면 미리보기로 보여주기
                                    postInfo.mainPhotoURL ? (
                                        <>
                                            <img src={postInfo.mainPhotoURL} alt="이미지 미리보기" value="다시 선택" style={{ width: '100px', height: '100px', padding: '0', marginBottom: ' 5px' }} />
                                            (이미지 미리보기)
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus style={{ marginBottom: '10px' }} />
                                            대표 사진 추가
                                        </>
                                    )
                                )}
                            </label>
                            <input type="file" id='representitiveImg' accept='image/*' onChange={onFileChange} style={{ display: 'none' }} />
                        </div>

                    </div>

                    <div>
                        <ReactQuill
                            ref={quillRef}
                            style={{ height: "600px" }}
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            preserveWhitespace
                            value={postInfo.post}
                            onChange={writePost}
                        />

                    </div>


                    <button className='submitBtn'>
                        {isLoading ? '업로드 중..' : '완료'}
                    </button>
                </form>
            </div>
        </PostWrapper>

    );
}

export default EditPost;

const PostWrapper = styled.div`
    .container{
        padding: 40px 0;
        form{
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 1080px;
            margin: 0 auto;
            .postTitle{
                display: flex;
                justify-content: space-around;
                align-items: center;
                text-align: center;
                label{
                    width: max-content;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    font-family: Noto Sans KR;
                    color: #888;
                    cursor: pointer;
                }
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