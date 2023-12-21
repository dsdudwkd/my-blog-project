import React from 'react';
import styled from 'styled-components';

function Post({posts} ) {
    return (
        <PostWrapper>
           
                <p>{posts.title}</p>
                <p>{posts.post}</p>
                <p>{posts.createdAt}</p>
                
            
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