import React from 'react';
import PostDetails from '../pages/PostDetails';

function SearchList({posts : {id, title, post, createdAt, mainPhotoURL} }) {
    return (
        <li>
            {/* <PostDetails post={{id, title, post, createdAt, mainPhotoURL}}/> */}
        </li>
    );
}

export default SearchList;