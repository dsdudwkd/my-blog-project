import React, { useEffect, useRef, useState } from 'react';
import SearchList from '../components/SearchList';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

function Search(props) {

    const [visible, setVisible] = useState(false);
    const [clearBtn, setClearBtn] = useState(false); //검색창에 값이 입력됐을 때 나오는 버튼
    const [text, setText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    /* 
    useRef() = DOM에 직접 접근하는 hook
    current로 값을 전달
    */
    const searchFormRef = useRef();

    const toggleInputOpen = (e) => {
        // 리액트에서는 기본 동작이 기본적으로 중지되지 않으므로 명시적으로 항상 e.preventDefault()를 추가해야 한다
        e.preventDefault();
        setVisible(true);
    }

    useEffect(() => {
        const onClose = (e) => {
            if (searchFormRef.current && !searchFormRef.current.contains(e.target)) {
                setVisible(false);
                setText('');
                setClearBtn(false);
            }
        }
        document.addEventListener('click', onClose);

        return () => {
            document.removeEventListener('click', onClose);
        }
    }, []);

    const onChange = (e) => {
        setText(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const postsRef = collection(db, "posts");
            const q = query(postsRef, where("title", "==", text));
            console.log(q);
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const data = querySnapshot.docs.map(doc => doc.data());
                setSearchResults(data);

                // if (allPost.length === 0) {
                //     return []
                // }
                /* const matchItem = allPost.filter((post) => {
                    const itemTitle = post.title.toLowerCase(); //받아온 문자열이 영어면 소문자로 변환
                    // console.log(itemTitle); //게시물 정보
                    return itemTitle.includes(query.toLowerCase());
                })
                return matchItem; */
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error(error);
        }

    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit(e);
        }
    }

    // const searchEvent = () => {
    //     if (query.trim() === '') {
    //         setResult([]);
    //     } else {
    //         onSubmit(query).then((text) => {
    //             setResult(text);
    //         }).catch((error) => console.error(error));
    //     }
    // }

    return (
        <>
            <SearchForm onSubmit={onSubmit} visible={`${visible}`} className={visible ? 'on' : null} ref={searchFormRef}>
                {/* 돋보기 버튼 눌렀을 때 입력창 나오게 */}
                <div className={`btn-container ${visible ? 'hide' : ''}`}>
                    <button onClick={toggleInputOpen} className='open-btn'>
                        <BiSearch className='search-btn' />
                    </button>
                </div>
                <div className={`btn-container ${visible ? '' : 'hide'}`}>
                    <button className='enter-btn' >
                        <BiSearch className='search-btn' />
                    </button>
                </div>


                {visible && (
                    <input type='text'
                        placeholder='검색어를 입력하세요.'
                        value={text}
                        onKeyDown={onKeyDown}
                        onChange={onChange} />
                )}

                <ul>
                    {searchResults.map((post) => (
                        <SearchList key={post.id} posts={post} />
                    ))}
                </ul>

                {/* {clearBtn && (
                    <button className='close-btn' onClick={onClear}>
                        <MdClose />
                    </button>
                )} */}
            </SearchForm>
        </>

    );
}

const SearchForm = styled.form`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    border-radius: 8px;
    position: relative;
    
    &.on{
        width: 300px; //위에서 고정으로 너비가 지정되어있으니 너비 늘려줘야함
        border: 1px solid #dedede;
    }
    input{
        width: ${({ visible }) => (visible ? '250px' : '0px')};
        transition: all 500ms;
        color: #333;
        outline: none;
        border: none;
    }
    .btn-container {
        display: flex;
        align-items: center;
        justify-content: center;
        .open-btn, .enter-btn{
            padding: 0;
            height: 36px;
            .search-btn{
                font-size: 24px;
                color: #555;
                padding: 6px;
            }
        }
    }
    .btn-container.hide {
        display: none;
    }
    /* .close-btn{
        color: #333;
        background-color: #333;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        margin-left: auto;
    } */
`

export default Search;