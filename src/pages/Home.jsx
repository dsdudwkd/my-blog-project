import React from 'react';
import Replies from '../components/WriteReply';
import { ref } from 'firebase/database';
import { getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import PostList from '../components/PostList';
import { auth } from '../api/firebase';

function Home(props) {

    return (
        <ContentWrapper>
            <div className='container'>
                <PostList/>
            </div>
        </ContentWrapper>
    );
}

export default Home;

const ContentWrapper = styled.div`
`