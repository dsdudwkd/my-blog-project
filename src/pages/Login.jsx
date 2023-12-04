import React from 'react';
import { googleLogIn } from '../api/firebase';
import { useNavigate } from 'react-router-dom';

function Login(props) {

    const navigate = useNavigate()

   /*  const googleLogIn = async (e) => {
        
        const user = await googleLogIn();
        navigate('/');
    } */

    return (
        <div className='container'>
            <h2>Login</h2>
            
            <button onClick={googleLogIn}>Google Login</button>
        </div>
    );
}

export default Login;