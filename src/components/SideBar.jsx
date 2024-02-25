import React from 'react';
import styled from 'styled-components';
import CategoryMenu from './CategoryMenu';

function SideBar(props) {
    return (
        <Sidebar>
            <CategoryItemList>
                <CategoryMenu />
            </CategoryItemList>
        </Sidebar>
    );
}

export default SideBar;

const Sidebar = styled.aside`
    float: left;
    box-sizing: border-box;
    width: 29.296296296296296%;
    padding: 80px 0 80px 20px;
`

const CategoryItemList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 20px;
`