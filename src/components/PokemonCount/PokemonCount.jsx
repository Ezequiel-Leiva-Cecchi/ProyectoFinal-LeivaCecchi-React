import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../index';

function PokemonCount({ Pokemon }) {
  const {  carrito, addCart } = useContext(CartContext);

  const [count, setCount] = useState(0);
  const [stock, setStock] = useState(0);
  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    async function fetchPrecioYStock() {
      try {
        const pokemonDoc = doc(db, 'pokemons', Pokemon.id);
        const pokemonData = await getDoc(pokemonDoc);

        if (pokemonData.exists()) {
          const { precio, stock } = pokemonData.data();
          setPrecio(precio || 0);
          setStock(stock || 0);
        }
      } catch (error) {
        console.error('Error al obtener datos de Firebase Firestore:', error);
      }
    }

    fetchPrecioYStock();
  }, [Pokemon.id]);

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
    if (count > 0 && count <= 10) {
      const item = { ...Pokemon, cantidad: count };
      const existingItem = carrito.find((p) => p.id === item.id);
  
      if (existingItem) {
        if (existingItem.cantidad + item.cantidad <= 10) {
          const updatedCarrito = carrito.map((p) =>
            p.id === item.id
              ? { ...p, cantidad: p.cantidad + item.cantidad }
              : p
          );
          addCart(updatedCarrito);
        } else {
          toast.error('No puedes agregar más de 10 de este Pokémon', {
            position: 'bottom-right',
          });
        }
      } else {
        if (item.cantidad <= stock) {
          addCart(item);
          setCount(0);
          console.log('Artículo añadido al carrito:', item);
          toast.success('Has agregado exitosamente al carrito', {
            position: 'bottom-right',
          });
        } else {
          console.error(`No puedes agregar más de ${stock} de este Pokémon.`);
        }
      }
    } else if (count > 10) {
      toast.error('No puedes agregar más de 10 de este Pokémon', {
        position: 'bottom-right',
      });
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
      <p>Precio por unidad: ${precio}</p>
      <p>Total: ${precio * count}</p>
      <p>Stock disponible: {stock}</p>
      <button
        disabled={count === 0}
        onClick={onAddToCart}
      >
        Comprar
      </button>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default PokemonCount;