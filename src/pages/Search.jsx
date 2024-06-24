import React, { useEffect, useRef, useState } from 'react';
import SearchList from '../components/SearchList';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

function Search(props) {

    const [text, setText] = useState('');
    const [result, setResult] = useState([]);
    const navigate = useNavigate();
    
    // 페이지 로드 시 로컬 스토리지에서 검색 결과를 가져옴
    const savedResult = localStorage.getItem('searchResult');
    useEffect(() => {
        if (savedResult) {
            setResult(JSON.parse(savedResult));
        }
    }, []);

    useEffect(() => {
        // 검색 결과가 변경될 때마다 로컬 스토리지에 저장
        localStorage.setItem('searchResult', JSON.stringify(result));
    }, [result]);

    const searchPost = async (word) => {
        navigate(`/search/${text}`);
        try {
            const q = query(collection(db, "posts"));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const matchItems = querySnapshot.docs.map(doc => {
                    const postData = doc.data();
                    return {
                        id: doc.id, // Add the id property
                        ...postData
                    };
                });
                const filteredItems = matchItems.filter(post => {
                    const postWord = post.title.toLowerCase() || post.post.toLowerCase();
                    return postWord.includes(word.toLowerCase());
                });
                return filteredItems;
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const searchEvent = async () => {
        if (text.trim() === '') {
            setResult([]);
        } else {
            try {
                const txt = await searchPost(text);
                setResult(txt);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const onChange = (e) => {
        setText(e.target.value);
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            searchEvent();
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
                <button onClick={searchEvent}>
                    <BiSearch />
                </button>
            </div>
            <div className='searchResultTitle'>
                {result.length > 0 ?
                    <h2>'<span>{text}</span>'의 검색 결과 <span>{result.length}</span></h2>
                    :
                    <h2>'<span>{text}</span>'의 검색 결과가 없습니다.</h2>
                }
            </div>
            <ul className='searchResultList'>
                {result.map((post) => (
                    <SearchList key={post.id} posts={post} />))
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
        margin-bottom: 80px;
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
    .searchResultTitle{
        display: flex;
        h2{
            color: #333;
            margin: 0 auto;
            margin-bottom: 30px;
            span{
                color: #fb5151;
            }
        }
    }
    .searchResultList{
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    li{
        width: 250px;
        max-height: 300px;
        .postsItem{
            display: flex;
            flex-direction: column;
            gap: 14px;
            cursor: pointer;
            img{
                height: 200px;
            }
            .no-image{
                background-color: #ebebeb;
                height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
                span{
                    color: #333;
                    font-weight: 600;
                }
                
            }
            .itemTitle{
                color: #333;
                text-overflow: ellipsis;
                font-family: Noto Sans KR;
            }
            p{
                display: -webkit-box; 
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3; //콘텐츠를 지정한 줄 수만큼으로 제한
                overflow: hidden;
                white-space: break-spaces;//연속된 공백을 적용
                color: #888;
                font-family: Noto Sans KR;
                p,em,span{
                    display: inline;
                    font-style: normal;
                    font-size: 14px;
                    text-overflow: ellipsis; //말줄임표
                    line-height: 1.2;
                }
            }
            .postDate{
                font-size: 12px;
            }
        }
        
        
    }
}
`

export default Search;