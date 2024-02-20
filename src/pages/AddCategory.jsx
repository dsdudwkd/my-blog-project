import React, { useEffect, useRef, useState } from 'react';
import { auth, db, onUserState } from '../api/firebase';
import { styled } from 'styled-components';
import CategoryList from '../components/CategoryList';
import { FaPlus } from "react-icons/fa";
import { addDoc, collection } from 'firebase/firestore';

function AddCategory(props) {

    const [category, setCategory] = useState('');

    const onChange = (e) => {
        setCategory(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (category.trim() === '') {
                alert('글자를 입력해주세요.');
                return;
             }
            await addDoc(collection(db, "categories"), {
                category: category,
                createdAt: Date.now(), //firestore는 기본적으로 문서의 id로 정렬이 되어 날짜 순으로 저장되길 바라서 createdAt 필드 추가
            })
            
        } catch (error) {
            console.error(error);
        } finally {
            document.querySelector('input').value = '';
            setCategory('');
        }
    }

    const cancelEvent = () => {
        setCategory('');
    }


    return (
        <CategoryWrapper className='container'>
            <Title>카테고리 관리</Title>
            <Form onSubmit={onSubmit} className='form container' >
                <div className='mainCategory'>
                    <input
                        type="text"
                        name="title"
                        placeholder='카테고리 추가'
                        onChange={onChange}
                        value={category}
                    />
                    <div className='buttons'>
                        <button type='reset' onClick={cancelEvent}>취소</button>
                        <button disabled={category.length < 1} className='addBtn'>추가</button>
                    </div>
                </div>
            </Form>
            <CategoryList category={category} />
        </CategoryWrapper>
    );
}

export default AddCategory;

const CategoryWrapper = styled.div`
    padding: 40px;
`

const Title = styled.h1`
    font-size: 30px;
    font-family: Noto Sans KR;
    padding: 10px;
    margin-bottom: 70px;
`

const Form = styled.form`
    margin-bottom: 100px;
    .mainCategory{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        input{
            width: 500px;
            padding: 10px;
            border: none;
            border-bottom: 1px solid #333;
            font-size: 16px;
            font-family: Noto Sans KR;
            color: #444;
            &:focus{
                outline: none;
            }
        }
        .buttons{
            margin-left: 10px;
            button{
                background-color: transparent;
                border: 1px solid #e0e0e0;
                border-radius: 2px;
                font-size: 14px;
                font-family: Noto Sans KR;
                padding: 10px 18px;
                &:first-of-type{
                    margin-right: 4px;
                }
                &:hover{
                    border: 1px solid #999;
                }
            }
            .submit{
                display: none;
            }
        }
    }
`
