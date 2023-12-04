import './App.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import GlobalStyle from './style/GlobalStyle';


function App() {


  return (
    <div>
      <GlobalStyle />
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
