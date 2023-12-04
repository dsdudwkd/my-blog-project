import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {GoogleAuthProvider, getAuth, signInWithPopup, signOut} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

//Firebase 앱을 초기화
const app = initializeApp(firebaseConfig);
//Firebase Authentication을 사용하기 위한 Auth 객체를 가져옴 
//Auth 객체를 사용해 사용자 인증과 관련된 다양한 작업 수행
const auth = getAuth();
//Google 소셜 로그인을 사용하기 위한 GoogleAuthProvider 객체를 생성 => 구글 로그인 수행 가능
const googleAuthProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

//GoogleAuthProvider를 사용할 때마다 구글 팝업을 항상 띄우기를 원한다는 의미 => 자동 로그인 현상 방지
googleAuthProvider.setCustomParameters({prompt : 'select_account'});

//구글 로그인
export async function googleLogIn() {
    try{
        // Google 로그인 팝업창 생성
        const result = await signInWithPopup(auth, googleAuthProvider);
        //로그인이 성공하면 결과에서 사용자 정보를 가져오기
        const user = result.user;
        console.log(user);
        console.log(user.displayName);
        //사용자 정보 반환
        return user;
    }catch(error){
        console.error(error);
    }
}

//구글 로그아웃
export async function googleLogOut(){
    try{
        await signOut(auth);
    }catch(error){
        console.error(error);
    }
}

export default firebase;
