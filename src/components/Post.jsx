import React from 'react';
import styled from 'styled-components';

function Post({posts : {title, post, createdAt}} ) {
    return (
        <PostWrapper>
           
                <p>{title}</p>
                <p>{post}</p>
                <p>{createdAt}</p>
                
            
        </PostWrapper>
    );
}

export default Post;

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.5);
`