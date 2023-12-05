import './App.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import GlobalStyle from './style/GlobalStyle';
import { AuthContextProvider } from './context/AuthContext';


function App() {


  return (
    <div>
      <AuthContextProvider>
      <GlobalStyle />
      <Header />
      <Outlet />
      </AuthContextProvider>
    </div>
  );
}

export default App;
