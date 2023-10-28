import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import './nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  const { carrito } = useContext(CartContext);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(carrito.length);
  }, [carrito]);

  return (
    <header>
      <nav className='container-nav'>
        <Link to={"/"}>
          <img src="assets/Planet.png" alt="Logo de la pagina" />
        </Link>
        <div>
          <ul className='list-buttons'>
            <li>
              <button className='button-link'><Link to={"/"}>Inicio</Link></button>
            </li>
            <li>
              <button className='button-link'><Link to={"/nosotros"}>Nosotros</Link></button>
            </li>
            <li>
              <button className='button-link'>
                <Link to={"/cart"}>
                  Carrito{' '}
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                  </svg>
                  <span>{cartItemCount}</span>
                </Link>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
