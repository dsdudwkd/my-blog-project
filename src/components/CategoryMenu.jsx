import React from 'react';
import {useQuery} from '@tanstack/react-query';
import { getCategories } from '../api/firebase';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function CategoryMenu(props) {

    const {data : categories} = useQuery(['categories'], getCategories)
    const setCategory = new Set();

    if(categories){
        categories.forEach((categoryObj)=>{
            setCategory.add(categoryObj.title);
        })
    }

    const setCategoryArr = [...setCategory];
    // console.log(setCategoryArr);
    return (
        <CategoryItemList>
            {setCategoryArr && setCategoryArr.map((category, index)=>(
                <CategoryItem key={index}>
                    <Link to={`/category/${category}`}>
                        {category}
                    </Link>
                </CategoryItem>
            ))}

        </CategoryItemList>
    );
}

export default CategoryMenu;

const CategoryItemList = styled.ul`
    display: flex;
    gap: 20px;
    padding: 24px;
`

const CategoryItem = styled.li`
    a{
        color: black;
    }
`