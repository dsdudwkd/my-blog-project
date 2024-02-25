import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../api/firebase';
import CategoryPostList from './CategoryPostList';

function CategoryPage(props) {

    const [posts, setPosts] = useState([]);
    const {category} = useParams();

    const getCategory = async (cate) => {
        const categoryRef = getDocs(collection(db, 'categories'));

        categoryRef.then((snapshot)=>{
            if(!snapshot.empty()){
                const allPosts = Object.values(snapshot.val());
                const filterPosts = allPosts.filter((post) => post.category === cate)
                return filterPosts;
            }
            return [];
        })
    }

    useEffect(() => {
        getCategory(category).then((el)=>{
            setPosts(el);
        })
        .catch((error) => {
            console.error(error);
        })
    }, [category])

    return (
        <div>
            <CategoryPostList category={category} product={posts} />
        </div>
    );
}

export default CategoryPage;