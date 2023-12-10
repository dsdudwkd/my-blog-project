import React, { useRef, useState } from 'react';
import { addCategory } from '../api/firebase';
import { styled } from 'styled-components';

function AddCategory(props) {

    const [category, setCategory] = useState({
        title: '',
        sub: {
            title: ''
        }
    });

    const addMainCategory = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value
        }));
    }
    const addSubCategory = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            sub: {
                ...prevCategory.sub,
                [name]: value
            }
        }));
    }

    const cancelAdd = () => {
        const mainCategory = document.querySelector('form');
        mainCategory.style.display = 'none';
    }

    const createMain = () => {
        const createMainCategory = document.querySelector('form');
        createMainCategory.style.display = 'block';
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            // 여기에서 Firebase에 데이터를 저장하도록 추가 작업이 필요합니다.
            console.log(category);

            // Firebase에 데이터를 저장하는 코드 추가
            await addCategory(category);
            // 저장 후에 폼 초기화
            setCategory({
                title: '',
                sub: {
                    title: ''
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <CategoryWrapper>
            <button onClick={createMain} >카테고리 추가</button>
            <form onSubmit={onSubmit}>
                <div className='mainCategory addMain'>
                    <input
                        type="text"
                        name="title"
                        placeholder='메인 카테고리 이름'
                        value={category.title}
                        onChange={addMainCategory}
                    />
                </div>
                <div className='subCategory addSub'>
                    <input
                        type="text"
                        name="title"
                        value={category.sub.title}
                        placeholder='서브 카테고리 이름'
                        onChange={addSubCategory}
                    />
                </div>
                {(category.title.length < 1) ? (<button type="submit" disabled>등록</button>) : (<button type="submit">등록</button>)}
            </form>
                <button onClick={cancelAdd} >취소</button>
            <div>
                
                
            </div>
        </CategoryWrapper>
    );
}

export default AddCategory;

const CategoryWrapper = styled.div`
    form{
        display: none;
    }
`