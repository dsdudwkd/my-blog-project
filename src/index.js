import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Login from './pages/Login';
import Join from './pages/Join';
import Search from './pages/Search';
import { useAuthContext } from './context/AuthContext';
import AddCategory from './pages/AddCategory';
import Profile from './pages/Profile';
import ResetPw from './pages/ResetPw';
import { auth } from './api/firebase';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import Loading from './components/Loading';
import CategoryPage from './components/CategoryPage';
import AllContent from './pages/Home';
import AllPosts from './components/AllPosts';

const root = ReactDOM.createRoot(document.getElementById('root'));

//관리자 인증
//관리자가 아닌 유저가 관리자 권한이 필요한 페이지에 접근했을 경우 처리하기 위한 컴포넌트 생성
const AdminRoute = ({ checkAdmin, children }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return
  }

  //현재 로그인한 사용자가 어드민이 아니거나 로그인하지 않은 경우 홈 화면으로 이동
  if (!user || (checkAdmin && !user.isAdmin)) {
    alert('접근 권한이 필요합니다.');
    return <Navigate to='/' replace />
  }
  return children;
}

//로그인하지 않은 상태면 로그인 페이지로 이동
const ProtectedRoute = ({ children }) => {
  // const user = auth.currentUser; // auth.currentUser처럼 바로 값을 받아오는 경우 페이지 이동이나 로드시 상태값이 바로 반영되지 않을 수 있다 
  const {user, isLoading} = useAuthContext(); //컨텍스트에서 사용자 상태와 로딩상태 가져옴
  
  if (isLoading) {
    return <Loading /> // 로딩 중인 경우 로딩 표시
  }
  
  if (!user) {
    return <Navigate to='/login' replace />; // 사용자가 로그인하지 않은 경우 로그인 페이지로 리디렉션
  }
  return children; // 사용자가 로그인한 경우 자식 컴포넌트 렌더링
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/newPost',
        element:
          //로그인한 사용자의 관리자 상태에 따라 <AdminRoute> 컴포넌트를 조건부로 렌더링하기 위한 것
          //checkAdmin이 true인 경우 <AdminRoute> 구성 요소는 사용자에게 관리자 권한이 있는지 확인
          <AdminRoute checkAdmin >
            <NewPost />
          </AdminRoute>
      },
      { path: '/search', element: <Search /> },
      { path: '/search/:id', element: <Search /> },
      { path: '/login', element: <Login /> },
      { path: '/resetPw', element: <ResetPw /> },
      { path: '/join', element: <Join /> },
      {
        path: '/profile',
        element:
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
      },
      {
        path: '/editCategory',
        element:
          <AdminRoute checkAdmin>
            <AddCategory />
          </AdminRoute>
      },
      { path: '/posts/detail/:id', element: <PostDetails /> },
      { path: '/posts/edit/:id', element: <EditPost /> },
      { path: '/category/:category', element: <CategoryPage /> },
      { path: '/category', element: <Home /> },
      { path: '/all', element: <AllPosts /> },
    ]
  }

])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
