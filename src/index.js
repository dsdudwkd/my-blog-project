import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound';
import AllContent from './pages/AllContent';
import NewPost from './pages/NewPost';
import Login from './pages/Login';
import Join from './pages/Join';
import Search from './pages/Search';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {path: '/all', element: <AllContent />},
      {path: '/newPost', element: <NewPost /> },
      {path: '/search', element:<Search />},
      {path: '/login', element: <Login />},
      {path: '/join', element: <Join/>},
      
    ]
  }
  
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
