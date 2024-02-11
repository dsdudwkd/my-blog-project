import React, { useEffect, useRef, useState } from 'react';
import SearchList from '../components/SearchList';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

function Search(props) {

    const [text, setText] = useState('');
    const [result, setResult] = useState([]);

    useEffect(()=>{
        if(text.trim() === ''){
            setResult([]);
        } else {
            searchPosts(text).then((txt)=>{
                setResult(txt);
            }).catch((error)=>{
                console.error(error);
            })
        }
    }, [text]);

    const searchPosts = async (word) => {
        try {
            const q = query(collection(db, "posts"));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const matchItem = querySnapshot.docs.map(doc => doc.data())
                return matchItem.filter(post => post.title.toLowerCase().includes(word.toLowerCase()));
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    
    const onChange = (e) => {
        setText(e.target.value);
    }


    const onKeyDown = (e) => {
        if (e.keyCode === 13) {

        }
    }

    return (
        <SearchWrapper className='container'>
            <div className='searchBox'>
                <input type='text'
                    placeholder='검색어를 입력하세요.'
                    value={text}
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                />
                <button>
                    <BiSearch />
                </button>
            </div>

            <ul className='searchResultList'>
                {Array.isArray(result) && result.map((post)=>{
                    <SearchList key={post.id} posts={post} />
                })
                    
                }
            </ul>
        </SearchWrapper>
    );
}

const SearchWrapper = styled.div`
    padding: 50px;
    .searchBox{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        input{
            width: 400px;
            height: 26px;
            padding: 6px;
            border: none;
            border-bottom: 1px solid #a5a5a5;
            font-size: 16px;
            color: #333;
        }
        input:focus{
            outline: none;
        }
        input::placeholder{
            font-family: Noto Sans KR;
            font-size: 16px;
        }
        button{
            display: flex;
            padding: 0;
            border: none;
            background-color: transparent;
            svg{
                width: 24px;
                height: 24px;
                color: #555;
            }
        }
        
    }
    .searchResultList{
    display: flex;
    gap: 14px;
    flex-direction: column;
    li{
        > div{
            display: flex;
            gap: 30px;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #ddd;
        }
    }
    img{
        width: 150px;
        border-radius: 10px;
        
    }
}
`

export default Search;