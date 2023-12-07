import React, { createContext, useContext, useEffect, useState } from 'react';
import { googleLogIn, logOut, onUserState } from '../api/firebase';

const AuthContext = createContext();

export function AuthContextProvider({children}) {

    const [user, setUser] = useState(); //user에 대한 정보를 받을 상태 변수
    const [unSubscribe, setUnSubscribe] = useState(); //컴포넌트가 마운트 해제될 때 상태값에 인증상태를 저장, 로그인 인증 상태

    //페이지를 마운트할 때마다 로그인 정보 업데이트
    /* 
    컴포넌트가 마운트되면 useEffect가 실행
    unSubScribe에는 onUserState(userChange)값이 담겨서 실행돼서 저장
    다른 컴포넌트가 마운트 해제되거나 혹은 다른 효과로 인해서 다시 실행
    */
    useEffect(()=>{
        const userChange = (newUser) => {
            setUser(newUser); //새로운 사용자 데이터로 상태를 업데이트
        }

        //위에서 새로 업데이트된 사용자를 onUserState로 넘김
        const unSubscribeFunc = onUserState(userChange)
        setUnSubscribe(()=>unSubscribeFunc); //unSubscribeFunc실행해라 = onUserState(userChange) 저장
        
        return () => { //함수를 실행해야 하므로 조건문으로 함수 호출
            if(unSubscribeFunc){
                unSubscribeFunc(); 
            }
        }
    },[])

    return (
        <AuthContext.Provider value={{user, googleLogIn, logOut}}>
            {children} {/* {children}은  모든 하위 컴포넌트*/}
        </AuthContext.Provider>
    );
}

//위의 함수들을 단순화 시켜서 다른 곳에서 참조할 수 있도록 export함
export function useAuthContext(){
    return useContext(AuthContext);
}