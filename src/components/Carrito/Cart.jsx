import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './cart.css';

function Cart() {
  const { carrito, clearCart, clearItem } = useContext(CartContext);

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const comprarTodo = () => {
    console.log('Compra realizada con éxito');
  };

  return (
    <div className="cart-container">
      <h1>Carrito de Compras</h1>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul>
          {carrito.map((item) => (
            <li key={item.id}>
              <div className="cart-item">
                <img src={item.img} alt={`Imagen de ${item.nombre}`} />
                <div className="item-details">
                  <h3>{item.nombre}</h3>
                  <p>Precio por unidad: ${item.precio}</p>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Subtotal: ${item.precio * item.cantidad}</p>
                  <button onClick={() => clearItem(item)}>Remover</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {carrito.length > 0 && (
        <div className="cart-total">
          <p>Total: ${calcularTotal()}</p>
          <button onClick={clearCart}>Vaciar Carrito</button>
          <button onClick={comprarTodo}>Comprar Todo</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
