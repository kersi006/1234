import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { ToastContainer } from './components/Toast/Toast';
import { Home } from './pages/Home/Home';
import { Catalog } from './pages/Catalog/Catalog';
import { GameDetail } from './pages/GameDetail/GameDetail';
import { Cart } from './pages/Cart/Cart';
import { Profile } from './pages/Profile/Profile';
import { Login } from './pages/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
