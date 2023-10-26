import React, { useContext } from 'react';
import './cart.css';
import { CartContext } from '../../context/AddCartContext';

function Cart() {
  const { carrito } = useContext(CartContext);

  const total = carrito.reduce((acc, Pokemon) => acc + Pokemon.price * Pokemon.cantidad, 0);

  return (
    <div className="cart-container">
      <h1>Carrito de Compras</h1>
      {carrito.length === 0 ? (
        <p>Aún no se ha agregado ningún Pokémon al carrito.</p>
      ) : (
        <ul>
          {carrito.map((Pokemon) => (
            <li key={Pokemon.id}>
              <img src={Pokemon.imageUrl} alt={Pokemon.name} />
              <p>{Pokemon.name}</p>
              <p>Cantidad: {Pokemon.cantidad}</p>
              <p>Precio: ${Pokemon.price}</p>
              <p>Subtotal: ${Pokemon.price * Pokemon.cantidad}</p> 
            </li>
          ))}
        </ul>
      )}
      <p className={carrito.length === 0 ? 'invisible' : 'visible'}>Total: ${total}</p>
    </div>
  );
}

export default Cart;