import React from 'react';
import SearchList from '../components/SearchList';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../api/firebase';

function Search(props) {

    const searchPost = async (e, query) => {
        try {
            const querySnapshot = await getDocs(collection(db, "posts"));

            console.log(querySnapshot.docs[0].id.title);
            if(querySnapshot.empty){
                return []
            } else {
                const allPost = querySnapshot.docs;
                if(allPost.length === 0) return [];

                
            }

        
        } catch (error) {
        console.error(error);
    }
}

return (
    <ul>
        <p onClick={searchPost}>검색창</p>
        <SearchList />
    </ul>
);
}

export default Search;