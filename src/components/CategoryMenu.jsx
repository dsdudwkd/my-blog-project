import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../api/firebase';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function CategoryMenu(props) {

    const [categories, setCategories] = useState([]);
    const setCategory = new Set();

    if(categories) {
        categories.forEach((categoryObj)=>{
            setCategory.add(categoryObj.category);
        })
    }
    const setCategoryArr = [...setCategory];

    useEffect(() => {
        let unSubscribe = null;

        const fetchCategories = async () => {
            const categoryQuery = query(
                collection(db, 'categories'),
                orderBy('createdAt', 'asc'), //카테고리 날짜순으로 정렬
            )
            unSubscribe = await onSnapshot((categoryQuery), (snapshot) => {
                const categoryArr = snapshot.docs.map((doc) => {
                    const { category } = doc.data();
                    // console.log(doc.data());
                    return {
                        category,
                        id: doc.id
                    }
                })
                setCategories(categoryArr);
            })
        }
        fetchCategories();
        return () => {
            if (unSubscribe) unSubscribe();
        }
    }, []);
    

    return (
        <>
            {setCategoryArr && setCategoryArr.map((category, index) => (
                <CategoryItem key={index}>
                    <Link to={`/category/${category}`} >
                        {category}
                    </Link>

                </CategoryItem>
            ))}
        </>
            
        
    );
}

export default CategoryMenu;

const CategoryItem = styled.li`
    a{
        color: #333;
    }
`