import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/AddCartContext';
import './pokemonCount.css';

function PokemonCount({ Pokemon }) {
  const { addCart } = useContext(CartContext); // Usar addCart en lugar de onAddToCart

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

  const onAddToCart = () => {
    if (count > 0) {
      addCart({ ...Pokemon, cantidad: count });
      setCount(0);
      console.log("Artículo añadido al carrito:", { ...Pokemon, cantidad: count });
    }
  };
console.log(onAddToCart)
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
      <button disabled={count === 0} onClick={onAddToCart}>
        Comprar
      </button>
    </div>
  );
}

export default PokemonCount;