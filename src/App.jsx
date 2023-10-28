import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {  Items } from './context/CartContext';
import Card from './components/Cards/Card';
import Nav from './components/Navbar/Nav';
import PokemonCount from './components/PokemonCount/PokemonCount';
import Nosotros from './components/QuienesSomos/Nosotros';
import Footer from './components/Footer/Footer';
import PokemonDetail from './components/PokemonDetail/PokemonDetail';
import Cart from './components/Carrito/Cart';



function App() {
  return (
    <Items>
      <BrowserRouter>
        <div className="nav-container"> 
          <Nav />
        </div>
        <div className="routes-container"> 
          <Routes>
            <Route path="/" element={<Card />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/detalles/:pokemonName" element={<PokemonDetail />} />
            <Route path="/contador" element={<PokemonCount />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
        <div className="footer-container"> 
          <Footer />
        </div>
      </BrowserRouter>
    </Items>
  );
}

export default App;