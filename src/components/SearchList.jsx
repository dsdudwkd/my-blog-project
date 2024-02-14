import React from 'react';
import PostDetails from '../pages/PostDetails';
import DetailPageEvent from './DetailPageEvent';

function SearchList({posts : {id, title, post, createdAt, mainPhotoURL} }) {

    console.log(id)

    return (
        <li>
            <DetailPageEvent post={{id, title, post, createdAt, mainPhotoURL}} />
        </li>
    );
}

export default SearchList;