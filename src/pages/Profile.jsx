import React from 'react';
import { Link } from 'react-router-dom';

function Profile(props) {
    return (
        <div>
            <h2>profile</h2>
            
            <Link to='/editCategory'>
                <button>카테고리 편집</button>
            </Link>
        </div>
    );
}

export default Profile;