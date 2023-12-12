import React from 'react';
import ShowCategory from './ShowCategory';

function CategoryList({ category, addSubCategory }) {
    return (
        <ul>
            {category.map((el, index) => (
                <ShowCategory
                    key={index}
                    category={el}
                    categoryIndex={index}
                    addSubCategory={addSubCategory}
                />
            ))}
        </ul>
    );
}

export default CategoryList;