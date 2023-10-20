import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/AddCartContext';
import './pokemonCount.css';

function PokemonCount({ Pokemon }) {
  let { addCart } = useContext(CartContext); 

  const [count, setCount] = useState(0);
  const [stock] = useState(10);

  const incrementCount = () => {
    if (count < stock) {
      setCount(count + 1);
    }
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  addCart = () => {
    if (count > 0) {
      addCart({ ...Pokemon, cantidad: count });
      setCount(0);
    }
  };

  return (
    <div>
      <div>
        <button onClick={decrementCount}>-</button>
        <span>{count}</span>
        <button onClick={incrementCount} disabled={count >= stock}>
          +
        </button>
      </div>
      <p>Precio por unidad: ${Pokemon.price}</p>
      <p>Total: ${Pokemon.price * count}</p>
      <p>Stock disponible: {stock}</p>
      <button disabled={count === 0} onClick={addCart}>
        Comprar
      </button>
    </div>
  );
}

export default PokemonCount;