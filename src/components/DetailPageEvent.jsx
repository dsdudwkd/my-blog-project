import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineImageNotSupported } from "react-icons/md";
import DOMPurify from 'dompurify';
function DetailPageEvent({ post }) {
    console.log(post)

    const navigate = useNavigate();
    const detail = () => {
        navigate(`/posts/detail/${post.id}`, {
            state: {
                id: post.id,
                title: post.title,
                post: post.post,
                createdAt: post.createdAt,
                mainPhotoURL: post.mainPhotoURL,

            }
        })
    }
    return (
        <div onClick={detail} className='postsItem'>
            {post.mainPhotoURL ? <img src={post.mainPhotoURL} alt={`${post.title}의 대표 이미지`} /> : <div className='no-image'><span>No Image</span></div>}
            <h3 className='itemTitle'>{post.title}</h3>
            <p dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.post,
                    {
                        ALLOWED_TAGS: ['p', 'em', 'span'], //p, em, span 태그만 보이게
                        ALLOWED_ATTR: { span: ["style"], p: ["style"], em: ["style"] } //p, em, span 태그에 style 적용되게끔
                    })
            }} />
            <p className='postDate'>{post.createdAt}</p>
        </div>
    );
}

export default DetailPageEvent;

