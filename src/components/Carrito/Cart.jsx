import React, { useContext } from 'react';
import { CartContext } from '../../context/AddCartContext';
import './cart.css';

function Cart() {
  const { cart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h1>Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>Aún no se ha agregado ningún Pokémon al carrito.</p>
      ) : (
        <div>
          {cart.map((Pokemon) => (
            <div key={Pokemon.id}>
              <p>{Pokemon.name}</p>
              <p>Cantidad: {Pokemon.quantity}</p>
              <p>Precio: ${Pokemon.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;