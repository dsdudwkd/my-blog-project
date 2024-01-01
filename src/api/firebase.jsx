import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { Firestore, Query, addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { get, getDatabase, ref, remove, set, update } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";
import { v4 as uuid } from 'uuid'; //고유 식별자를 생성해주는 패키지

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
export const auth = getAuth(app);
//Google 소셜 로그인을 사용하기 위한 GoogleAuthProvider 객체를 생성 => 구글 로그인 수행 가능
const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();
const database = getDatabase(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

//GoogleAuthProvider를 사용할 때마다 구글 팝업을 항상 띄우기를 원한다는 의미 => 자동 로그인 현상 방지
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
githubAuthProvider.setCustomParameters({ prompt: 'select_account' });

//구글 로그인
export async function googleLogIn() {
    try {
        // Google 로그인 팝업창 생성
        const result = await signInWithPopup(auth, googleAuthProvider);
        //로그인이 성공하면 결과에서 사용자 정보를 가져오기
        const user = result.user;
        console.log(user);
        //사용자 정보 반환
        return user;
    } catch (error) {
        console.error(error);
    }
}

//깃허브 로그인
export async function gitHubLogin() {
    try {
        githubAuthProvider.addScope('repo');
        const result = await signInWithPopup(auth, githubAuthProvider);
        const user = result.user;
        console.log(user);
        return user;
    } catch (error) {
        console.error(error);
    }
}

//로그아웃
export async function logOut() {
    try {
        //signOut() = Firebase Authentication에서 제공하는 함수, 현재 로그인된 사용자를 로그아웃시키는 역할
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
}

//관리자 계정 관리
async function admin(user) {
    try {
        //snapShot = Firebase Realtime Database에서 데이터를 가져올 때 반환되는 객체
        //'admin' 경로에서 데이터를 가져와서 그 순간의 상태를 snapShot에 저장하고 상태를 확인하여 존재 여부 판단
        const snapShot = await get(ref(database, 'admin'));

        if (snapShot.exists()) {
            const admin = snapShot.val();
            const isAdmin = admin.includes(user.email);
            return { ...user, isAdmin }
        }
        return user;
    } catch (error) {
        console.error(error);
    }
}

//로그인한 계정 정보 계속 유지
//일반적으로 인증 상태에 따라 UI를 업데이트하는 데 사용
export function onUserState(callback) {
    //인증 상태가 변경되면(사용자가 로그인하거나 로그아웃할 때) 이 함수가 호출
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const updateUser = await admin(user);
                callback(updateUser);
            } catch (error) {
                console.error(error);
            }
        } else {
            callback(null);
        }
    })
}


//회원가입한 이메일로 로그인하기
export async function loginEmail(email, password) {
    try {
        const userAccount = await signInWithEmailAndPassword(auth, email, password);
        return userAccount.user;
    } catch (error) {
        console.error(error);
    }
}

//파이어베이스에 카테고리 연동
export async function addCategory(category) {
    const id = uuid();
    return await addDoc(collection(db, 'categories'), {
        mainCategory: category,
    });
}

//연동된 카테고리 가져오기
export async function getCategories() {
    return get(ref(database, 'category')).then((snapShot) => {
        if (snapShot.exists()) {
            return Object.values(snapShot.val());
        } else {
            return []
        }
    })
}

export default firebase;
