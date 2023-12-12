import './App.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import GlobalStyle from './style/GlobalStyle';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
      <GlobalStyle />
      <Header />
      <Outlet />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
