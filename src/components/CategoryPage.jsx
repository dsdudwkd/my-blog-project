import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../api/firebase';
import CategoryPostList from './CategoryPostList';

function CategoryPage(props) {

    const [posts, setPosts] = useState([]);
    const { category } = useParams();
    
    const getCategory = async (cate) => {
        try {
            const categoryRef = query(collection(db, 'posts'));
            const snapShot = await getDocs(categoryRef);
            if (!snapShot.empty) {
                const allCategories = snapShot.docs.map(doc => {
                    const postData = doc.data();
                    return {
                        id: doc.id,
                        ...postData
                    }
                });
                const filterCategories = allCategories.filter((post) => post.category === cate);
                return filterCategories;
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    useEffect(() => {
        getCategory(category).then((el) => {
            setPosts(el);
        })
            .catch((error) => {
                console.error(error);
            })
    }, [category])

    return (
        <div>
            <CategoryPostList category={category} posts={posts} />
        </div>
    );
}

export default CategoryPage;