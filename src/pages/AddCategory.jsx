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
        const createMainCategory = document.querySelector('input');
        createMainCategory.style.display = 'block';
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try{
            await addCategory(category);
            setCategory([]);
            setNewCategory('');
        } catch(error){
            console.error(error);
        }
    }


    return (
        <>
            <button onClick={createMain} >카테고리 추가</button>
            <form onSubmit={onSubmit} className='form' >
                <div className='mainCategory addMain'>
                    <input
                        type="text"
                        name="title"
                        placeholder='메인 카테고리'
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                </div>

                <button onClick={cancelAdd} >취소</button>
                {(newCategory.length < 1) ? (<button type="submit" onClick={addMainCategory} disabled>등록</button>) : (<button type="submit" onClick={addMainCategory}>등록</button>)}
            </form>

                <CategoryList category={category} addSubCategory={addSubCategory} />


        </>
    );
}

export default AddCategory;

