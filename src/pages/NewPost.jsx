import React, { useState } from 'react';

function NewPost(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState({
        title: '',
        main: ''
    })

    const onChange = (e) => {
        setPost(e.target.value)
    }

    return (
        <>
            <div>
                <div className='container'>
                    <div className='quillAPI'>

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
                            name="post-title"
                            id="post-title"
                            cols="30"
                            rows="10"
                            placeholder='제목'
                            value={post.title}
                            onChange={onChange}
                        />
                    </div>
                    <div className='postContainer'>
                        <textarea
                            name="write-post"
                            id="write-post"
                            cols="30"
                            rows="10"
                            placeholder='본문'
                            value={post.main}
                            onChange={onChange}
                        />
                    </div>
                    <button type='submit'>
                        {isLoading? '업로드 중..' : '완료'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default NewPost;