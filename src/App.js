import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { Outlet, Route, Router, Routes } from 'react-router-dom';
import GlobalStyle from './style/GlobalStyle';


function App() {


  return (
    <div>
      <Header />
      <Outlet />
      <GlobalStyle />
    </div>
  );
}

export default App;
