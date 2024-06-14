import './App.css';
import Header from './components/Header';
import { Outlet, Route, Routes } from 'react-router-dom';
import GlobalStyle from './style/GlobalStyle';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import TopBtn from './components/TopBtn';
import Footer from './components/Footer';

function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
        <Outlet />
        <TopBtn />
        <Footer />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
