import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../api/firebase';

function AllPosts(props) {

    
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let unsubscribe = null;
        const fetchPosts = async () => {
            const postQuery = query(
                collection(db, 'posts'),
                orderBy("createdAt", "desc"),
                limit(8) //글을 전부 읽고 불러오는 대신 갯수를 한정지어 그 갯수만큼만 불러오기 => 비용 절약할 수 있음 & slice(0, 8) 대신 사용 가능
            );
            //더 이상 데이터를 리슨할 필요가 없으면 이벤트 콜백이 호출되지 않도록 리스너를 분리해야 함(비용 지불 되기 때문)
            unsubscribe = await onSnapshot((postQuery), (snapshot) => {
                const postArr = snapshot.docs.map((doc) => {
                    const { title, post, createdAt, userId, userName, mainPhotoURL } = doc.data();
                    return {
                        title,
                        post,
                        createdAt,
                        userId,
                        userName,
                        mainPhotoURL,
                        id: doc.id,
                    }
                })
                setPosts(postArr)
            })
        }
        fetchPosts();
        return () => {
            //useEffect의 cleanup 기능을 이용하여 이 컴포넌트가 사용되지 않을 때(unmount일 때) unsubscribe 함수 호출
            //ex) 유저가 로그아웃 되었거나, 다른 화면에 있을 때
            if (unsubscribe) unsubscribe();
        }
    }, []);

    const details = (postId) => {
        const post = posts.find((p) => p.id === postId);

        if (post) {
            navigate(`posts/detail/${post.id}`, {
                state: { ...post }
            })
        }
    }


    return (
        <div>
            
        </div>
    );
}

export default AllPosts;