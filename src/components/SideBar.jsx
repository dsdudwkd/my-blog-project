import React from 'react';
import CategoryList from './CategoryList';
import styled from 'styled-components';

function SideBar(props) {
    return (
        <Sidebar>
            <CategoryList />
        </Sidebar>
    );
}

export default SideBar;

const Sidebar = styled.aside`
    float: left;
    box-sizing: border-box;
    width: 21.296296296296296%;
    padding: 80px 0;
    border-right: 1px solid #e6e6e6;
`