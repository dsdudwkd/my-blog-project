import React, { useRef, useState } from 'react';
import { addCategory } from '../api/firebase';
import { styled } from 'styled-components';
import CategoryList from '../components/CategoryList';

function AddCategory(props) {

    const [category, setCategory] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    const addMainCategory = () => {
        const newCategoryItem = {
            name: newCategory,
            subCategoryItem: []
        };
        setCategory([...category, newCategoryItem]);
        setNewCategory('');
    }

    const addSubCategory = (categoryIndex, subCategoryName) => {
        if (!subCategoryName) return;

        setCategory(category.map((el, index) => {
            if (index === categoryIndex) {
                return {
                    ...el,
                    subCategoryItem: [...el.subCategoryItem, { name: subCategoryName }],
                }
            }
            return el;
        }));
    }

    const cancelAdd = () => {
        const mainCategory = document.querySelector('input');
        mainCategory.style.display = 'none';
    }

    const createMain = () => {
        const createMainCategory = document.querySelector('.addMain');
        createMainCategory.style.display = 'block';
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await addCategory(category);
            setCategory([]);
            setNewCategory('');
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <CategoryWrapper className='container'>
            <AddButton onClick={createMain} >카테고리 추가</AddButton>
            <form onSubmit={onSubmit} className='form' >
                <div className='mainCategory addMain' style={{ display: 'none' }}>
                    <input
                        type="text"
                        name="title"
                        placeholder='메인 카테고리'
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button onClick={cancelAdd} >취소</button>
                    <button type="submit" disabled={newCategory.length < 1} onClick={addMainCategory}>등록</button>
                </div>
            </form>
            <CategoryList category={category} addSubCategory={addSubCategory} />
        </CategoryWrapper>
    );
}

export default AddCategory;

const CategoryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 15px;
    padding: 20px;
    height: 600px;
`

const AddButton = styled.button`
    border: none;
`

