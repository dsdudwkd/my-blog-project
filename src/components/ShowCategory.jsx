import React, { useState } from 'react';
import { addCategory } from '../api/firebase';

function ShowCategory({ category, categoryIndex, addSubCategory }) {

    const [subCategory, setSubCategory] = useState('');
    const [showList, setShowList] = useState(false);

    const cancelAdd = () => {
        const subCategoryInput = document.querySelector('input');
        subCategoryInput.style.display = 'none';
    }

    const addSubCategoryBtn = () => {
        addSubCategory(categoryIndex, subCategory);
        setSubCategory('');
        setShowList(false);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await addCategory(category);
            addSubCategory(categoryIndex, subCategory);
            setSubCategory('');
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <form onSubmit={onSubmit}>
            <li>
                {category.name}
                <button onClick={() => setShowList(!showList)}>서브 카테고리 추가</button>
                <button>수정</button>
                <button >삭제</button>
                {category.subCategoryItem.length > 0 && (
                    <ul>
                        {category.subCategoryItem.map((subEl, subIndex) =>
                            <li key={subIndex}>
                                {subEl.name}
                                <button>수정</button>
                                <button>삭제</button>
                            </li>
                        )}
                    </ul>
                )}

                {showList && (
                    <>
                        <input type="text" placeholder='서브 카테고리' value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
                        <button onClick={cancelAdd} >취소</button>
                        {(subCategory.length < 1) ?
                            (<button type="submit" onClick={addSubCategoryBtn} disabled>등록</button>) : (<button type="submit" onClick={addSubCategoryBtn}>등록</button>)}
                    </>
                )}
            </li>
        </form>
    );
}

export default ShowCategory;