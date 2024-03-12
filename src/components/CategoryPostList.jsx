import React from 'react';
import DetailPageEvent from './DetailPageEvent';
import styled from 'styled-components';
import SideBar from './SideBar';
function CategoryPostList({ category, posts }) {
    return (
        <>

            <CategoryPostWrapper className='container'>
                <div>
                    <h2>{category} <p>{posts.length}</p></h2>
                </div>
                {posts.length > 0 ?
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id}>
                                <DetailPageEvent post={post} />
                            </li>
                        ))}
                    </ul>
                    :
                    <div className='nothing'>
                        <p>선택하신 카테고리에 해당하는 글이 없습니다.</p>
                        <p>다른 카테고리를 선택하시거나, 검색 기능을 활용해 보세요.</p>
                    </div>
                }
            </CategoryPostWrapper>
        </>

    );
}

export default CategoryPostList;

const CategoryPostWrapper = styled.div`
    padding: 50px;
    min-height: 1280px;
    h2{
        display: flex;
        justify-content: center;
        color: #333;
        margin: 0 auto;
        margin-bottom: 50px;
        p{
            color: red;
            margin-left: 10px;
        }
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
    .nothing{
        margin: 0 auto;
        position: relative;
        width: 50%;
        p{
            font-family: Noto Sans KR;
            &:first-of-type{
                margin-bottom: 10px;
            }
        }
    }
`