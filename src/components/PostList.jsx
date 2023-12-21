import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PostItem from './Post';
import { db, getPosts } from '../api/firebase';
import DOMPurify from 'dompurify';
import Post from './Post';


function PostList(props) {

    const [posts, setPosts] = useState([])

    const fetchPosts = async () => {
        const postQuery = query(
            collection(db, 'posts'),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(postQuery);
        const postArr = snapshot.docs.map((doc) => {
            const { post, createdAt, userId, userName, photoURL } = doc.data();
            return {
                post,
                createdAt,
                userId,
                userName,
                photoURL,
                id: doc.id,
            }
        })
        setPosts(postArr)
    }

    useEffect(() => {
        fetchPosts();
    }, []);




    return (
        <ul className='posttList'>
            {JSON.stringify(posts)};
            <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(posts.map((el) => (el.post))),
            }}
            />
            <Post posts={posts}/>
        </ul>
    );
}

export default PostList;