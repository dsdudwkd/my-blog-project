import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../api/firebase';
import styled from 'styled-components';

function CategoryList() {

    const [categories, setCategories] = useState([]);
    const [edit, setEdit] = useState('');
    const [editingId, setEditingId] = useState(null); // 수정 중인 카테고리의 ID를 저장합니다.
    const [newCategoryName, setNewCategoryName] = useState(''); // 새로운 카테고리 이름을 저장합니다.
    const [hoveredId, setHoveredId] = useState(null); // 마우스가 올라가 있는 카테고리의 ID를 저장합니다.

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

    const mouseEnter = (id) => {
        setHoveredId(id);
    }

    const mouseLeave = () => {
        setHoveredId(null);
    }

    //확인 버튼 눌렀을 때 카테고리 업데이트
    const editCategory = async () => {
        if (editingId && newCategoryName) {
            const categoryRef = doc(db, 'categories', editingId);
            await updateDoc(categoryRef, { category: newCategoryName });
            setEditingId(null);
            setNewCategoryName('');
        }
    };

    //수정 버튼 누를 시 해당 카테고리의 id와 현재 이름 상태에 저장
    const startEditing = (categoryId, currentName) => {
        setEditingId(categoryId);
        setNewCategoryName(currentName);
    };

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
        setEditingId('');
    }

    return (
        <CategoryListWrapper className='container'>
            <h3>카테고리 목록</h3>
            <div className='categoryLists'>
                {categories.map((cate) => (
                    <li key={cate.id} onMouseEnter={() => { mouseEnter(cate.id) }} onMouseLeave={mouseLeave}>
                        {editingId === cate.id ? (
                            // 수정 중인 카테고리는 input과 확인 버튼을 보여줍니다.
                            <div className='editingArea'>
                                <input className='editInput' value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                                <button type='reset' onClick={cancelEvent}>취소</button>
                                <button className='submit' onClick={editCategory}>확인</button>
                            </div>
                        ) : (
                            // 그 외의 카테고리는 카테고리 이름과 수정 버튼을 보여줍니다.
                            <>
                                <div className='categoryList'>{cate.category}</div>
                                <div className='hoverBtn' style={{ display: hoveredId === cate.id ? 'block' : 'none' }}>
                                    <button onClick={() => startEditing(cate.id, cate.category)}>수정</button>
                                    <button onClick={() => deleteCategory(cate.id)}>삭제</button>
                                </div>

                            </>
                        )}
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
    .categoryLists{
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
            .editingArea{
                display: flex;
                align-items: center;
                input{
                    width: 310px;
                    padding: 8px;
                    margin-right: 130px;
                    border: 1px solid #d0d0d0;
                    border-radius: 2px;
                    font-size: 16px;
                    &:focus{
                        outline: none;
                    }
                }
                button{
                    padding: 8px 20px;
                    border: 1px solid #d0d0d0;
                    border-radius: 2px;
                    background-color: #fff;
                    &:first-of-type{
                        margin-right: 4px;
                    }
                    &:hover{
                        border: 1px solid #999;
                    }
                }                
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
                    border-radius: 2px;
                    background-color: #fff;
                    font-family: Noto Sans KR;
                    &:first-of-type{
                        margin-right: 4px;
                    }
                    &:hover{
                        border: 1px solid #999;
                    }
                }
            }

        }
    }
    
`