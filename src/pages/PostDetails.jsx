import { collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../api/firebase';

function PostDetails(props) {
    const state = useLocation().state;
    const { post } = state;


    return (
        <DetailsWrapper>
            {/* <div className='container'>
                <div className='title'>
                    <h2>{post.title}</h2>
                    <span>{post.userName}</span>
                    <span>{post.createdAt}</span>
                </div>
                <div>
                    <p>{post.post}</p>
                </div>
                <div>
                    <button>수정</button>
                    <button>삭제</button>
                </div>
            </div> */}
        </DetailsWrapper>
    );
}

export default PostDetails;

const DetailsWrapper = styled.div`

`