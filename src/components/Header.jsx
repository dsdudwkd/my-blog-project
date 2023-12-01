import React from 'react';
import { Link } from 'react-router-dom';
import main_name from '../img/main_name.png';

function Header(props) {
    return (
        <div>
            <Link to='/'>
                <h1 style={{ fontFamily: 'Ephesis', fontSize: '50px',}}>Annalog</h1>
            </Link >
        </div>
    );
}

export default Header;