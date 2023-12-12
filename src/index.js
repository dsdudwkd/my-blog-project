import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound';
import AllContent from './pages/AllContent';
import NewPost from './pages/NewPost';
import Login from './pages/Login';
import Join from './pages/Join';
import Search from './pages/Search';
import { useAuthContext } from './context/AuthContext';
import AddCategory from './pages/AddCategory';
import { getAuth } from 'firebase/auth';
import Profile from './pages/Profile';

const root = ReactDOM.createRoot(document.getElementById('root'));

//관리자 인증
//관리자가 아닌 유저가 관리자 권한이 필요한 페이지에 접근했을 경우 처리하기 위한 컴포넌트 생성
const AdminRoute = ({ checkAdmin, children }) => {
  const { user } = useAuthContext();

  //현재 로그인한 사용자가 어드민이 아니거나 로그인하지 않은 경우 홈 화면으로 이동
  if (!user || (checkAdmin && !user.isAdmin)) {
    return <Navigate to='/' replace />
  }
  return children;
}

//로그인하지 않은 상태면 로그인 페이지로 이동
const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to='/login' />
  }
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { path: '/all', element: <AllContent /> },
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
      { path: '/login', element: <Login /> },
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
      }

    ]
  }

])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
