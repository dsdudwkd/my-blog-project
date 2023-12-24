import React, { useRef, useState } from 'react';
import { addCategory } from '../api/firebase';
import { styled } from 'styled-components';
import CategoryList from '../components/CategoryList';
import { FaPlus } from "react-icons/fa";

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
        const mainCategory = document.querySelector('.addMain');
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
            <Title>카테고리 관리</Title>
            <AddButton onClick={createMain} >
                카테고리 추가
                <FaPlus />
            </AddButton>
            <Form onSubmit={onSubmit} className='form' >
                <div className='mainCategory addMain' style={{ display: 'none' }}>
                    <input
                        type="text"
                        name="title"
                        placeholder='메인 카테고리'
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <div className='buttons'>
                        <button onClick={cancelAdd} >취소</button>
                        <button type="submit" disabled={newCategory.length < 1} onClick={addMainCategory} >등록</button>
                    </div>
                </div>
            </Form>
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
    padding: 40px;
    height: 600px;
`

const Title = styled.h1`
    font-size: 30px;
    padding: 10px;
    margin-bottom: 50px;
`

const AddButton = styled.button`
    border: 1px solid #999;
    border-radius: 10px;
    width: 600px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    background-color: #fff;
    color: #555;
`
const Form = styled.form`
    margin: 0 auto;
    width: 600px;
    .mainCategory{
        width: 100%;
        input{
            padding: 10px 20px;
        }
        .buttons{
            display: inline-block;
        }
    }
`
