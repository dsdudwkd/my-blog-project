import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../api/firebase';
import styled from 'styled-components';

function CategoryList() {

    const [categories, setCategories] = useState([]);
    const [edit, setEdit] = useState('');

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

    const mouserEnter = (event) => {
        const hoverBtn = event.currentTarget.querySelector('.hoverBtn');
        hoverBtn.style.display = '';
    }

    const mouseLeave = (event) => {
        const hoverBtn = event.currentTarget.querySelector('.hoverBtn');
        hoverBtn.style.display = 'none';

    }

    const editCategory = async (e, categoryId) => {
        // 수정 버튼을 누르면 input에 기존 카테고리 이름이 나타납니다.
        const input = document.querySelector('input');
        input.value = e.currentTarget.parentElement.parentElement.children[0].innerText;
        document.querySelector('.addBtn').innerText = '확인'
        console.log(categoryId);
        // 확인 버튼을 누르면 이벤트 핸들러가 실행됩니다.
        const confirmBtn = document.querySelector('.addBtn');
        confirmBtn.addEventListener('click', async ()=>{
            try {
                // input의 value를 새로운 카테고리 이름으로 설정합니다.
                // const newCategoryName = edit;
                const categoryRef = doc(db, 'categories', categoryId);
                await updateDoc(categoryRef, {
                    category: input.value
                });
                // setEdit('');
                document.querySelector('.addBtn').innerText = '추가';
                input.value = '';
            } catch (error) {
                console.error(error);
            }
        })
        

    }

    const deleteCategory = async (categoryId) => {
        const ok = window.confirm('정말 삭제하시겠습니까?');
        if (!ok) return;
        try {
            await deleteDoc(doc(db, 'categories', categoryId));
        } catch (error) {
            console.error(error);
        }
    }

    const cancelEvent = () => {
        setEdit('');
    }

    return (
        <CategoryListWrapper className='container'>
            <h3>카테고리 목록</h3>
            <div>
                {categories.map((cate) => (
                    <li key={cate.id} onMouseEnter={mouserEnter} onMouseLeave={mouseLeave}>
                        <div className='categoryList'>
                            {cate.category}
                        </div>
                        <div className='hoverBtn' style={{ display: 'none' }}>
                            <button onClick={(e) => editCategory(e, cate.id)}>수정</button>
                            <button onClick={() => deleteCategory(cate.id)}>삭제</button>
                        </div>
                    </li>
                ))}
            </div>
        </CategoryListWrapper>
    );
}

export default CategoryList;

const CategoryListWrapper = styled.ul`
    position: relative;
    h3{
        margin: 0;
        margin-bottom: 10%;
        font-size: 20px;
        font-family: Noto Sans KR;
        color: #333;
    }
    div{
        li{
            width: 600px;
            height: 16px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            position: relative;
            border: 1px solid #f1f1f1;
            &:hover{
                border: 1px solid #d0d0d0;
            }
            .categoryList {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                margin-right: 200px;
                color: #333;
                font-size: 16px;
                font-family: Noto Sans KR;
            }
            .hoverBtn{
                display: flex;
                position: absolute;
                top: 10px;
                right: 20px;
                button{
                    padding: 6px 12px;
                    border: 1px solid #d0d0d0;
                    &:first-of-type{
                        margin-right: 4px;
                    }
                }
            }

        }
    }
    
`