import React from 'react';
import styled from 'styled-components';
import CategoryMenu from './CategoryMenu';
import AllPosts from './AllPosts';

function SideBar(props) {
    return (
        <div className='container'>

            <Sidebar>
                <CategoryItemList>
                    <div>
                        분류 전체보기
                        <AllPosts />
                    </div>
                    <CategoryMenu />
                </CategoryItemList>
            </Sidebar>
        </div>

    );
}

export default SideBar;

const Sidebar = styled.aside`
    float: left;
    box-sizing: border-box;
    width: 21.296296296296296%;
    padding: 80px 0;
`

const CategoryItemList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 40px;
    color: #666;
    font-size: 16px;
    font-family: 'Noto Sans KR','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    .categoryMenu{
        position: relative;
        color: #666;
        font-size: 16px;
        font-family: 'Noto Sans KR','Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        &:hover{
            color: black;
        }
        &:hover::after{
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #666;
        }
    }
`