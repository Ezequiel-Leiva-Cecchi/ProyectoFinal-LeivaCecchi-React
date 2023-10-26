import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/AddCartContext';
import './pokemonCount.css';

function PokemonCount({ Pokemon }) {
  const { carrito, addCart } = useContext(CartContext);

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
      const item = { ...Pokemon, cantidad: count };
      const existingItem = carrito.find((p) => p.id === item.id);

      if (existingItem) {
        if (existingItem.cantidad + item.cantidad <= stock) {
          const updatedCarrito = carrito.map((p) =>
            p.id === item.id ? { ...p, cantidad: p.cantidad + item.cantidad } : p
          );
          addCart(updatedCarrito);
        } else {
          console.error("No puedes agregar más de 10 de este Pokémon.");
        }
      } else {
        if (item.cantidad <= stock) {
          addCart(item);
        } else {
          console.error("No puedes agregar más de 10 de este Pokémon.");
        }
      }

      setCount(0);
      console.log("Artículo añadido al carrito:", item);
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
      <button
        disabled={count === 0 || count >= stock || (carrito.find((p) => p.id === Pokemon.id)?.cantidad || 0) >= stock}
        onClick={onAddToCart}
      >
        Comprar
      </button>
    </div>
  );
}

export default PokemonCount;