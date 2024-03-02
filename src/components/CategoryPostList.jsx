import React from 'react';
import DetailPageEvent from './DetailPageEvent';
import styled from 'styled-components';
function CategoryPostList({ category, posts }) {
    return (
        <CategoryPostWrapper>
            <div>
                <h2>{category}</h2>
                <span>{posts.length}</span>
            </div>

            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <DetailPageEvent post={post} />
                    </li>
                ))}
            </ul>
        </CategoryPostWrapper>
    );
}

export default CategoryPostList;

const CategoryPostWrapper = styled.div`
    padding: 50px;
    h2{
        display: flex;
        justify-content: center;
        color: #333;
        margin: 0 auto;
    }
    ul{
        min-height: 1280px;
        display: flex;
        gap: 30px;
        flex-wrap: wrap;
        li{
            width: 250px;
            max-height: 300px;
            .postsItem{
                display: flex;
                flex-direction: column;
                gap: 14px;
                cursor: pointer;
                img{
                    height: 200px;
                }
                .no-image{
                    background-color: #ebebeb;
                    height: 200px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span{
                        color: #333;
                        font-weight: 600;
                    }
                    
                }
                .itemTitle{
                    color: #333;
                    text-overflow: ellipsis;
                    font-family: Noto Sans KR;
                }
                p{
                    display: -webkit-box; 
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3; //콘텐츠를 지정한 줄 수만큼으로 제한
                    overflow: hidden;
                    white-space: break-spaces;//연속된 공백을 적용
                    color: #888;
                    font-family: Noto Sans KR;
                    p,em,span{
                        display: inline;
                        font-style: normal;
                        font-size: 14px;
                        text-overflow: ellipsis; //말줄임표
                        line-height: 1.2;
                    }
                }
                .postDate{
                    font-size: 12px;
                }
            }
        }
    }
`