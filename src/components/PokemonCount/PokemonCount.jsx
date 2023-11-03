import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../index';

function PokemonCount({ Pokemon }) {
  const { carrito, addCart } = useContext(CartContext);

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
    if (count < stock && count < 10) {
      setCount(count + 1);
    } else {
      toast.error('No puedes agregar más de 10 elementos de este Pokémon', {
        position: 'bottom-right',
      });
    }
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const onAddToCart = () => {
    if (Pokemon) {
      if (count > 0 && count <= stock) {
        const item = { ...Pokemon, cantidad: count };
        const existingItem = carrito.find((p) => p.id === item.id);

        if (existingItem) {

          if (existingItem.cantidad + count <= 10) {
            const updatedCarrito = carrito.map((p) =>
              p.id === item.id ? { ...p, cantidad: p.cantidad + item.cantidad } : p
            );
            addCart(updatedCarrito);
            setCount(0);
            toast.success('Has agregado exitosamente al carrito', {
              position: 'bottom-right',
            });
          } else {
            toast.error('No puedes agregar más de 10 elementos de este Pokémon al carrito', {
              position: 'bottom-right',
            });
          }
        } else {
          addCart(item);
          setCount(0);
          toast.success('Has agregado exitosamente al carrito', {
            position: 'bottom-right',
          });
        }
      } else {
        toast.error('Selecciona una cantidad válida y asegúrate de que haya suficiente stock', {
          position: 'bottom-right',
        });
      }
    } else {
      console.error('Pokemon is undefined or empty.');
    }
  }

  return (
    <div>
      <div>
        <button onClick={decrementCount}>-</button>
        <span>{count}</span>
        <button onClick={incrementCount} disabled={count >= stock || count >= 10}>
          +
        </button>
      </div>
      <p>Precio por unidad: ${precio}</p>
      <p>Total: ${precio * count}</p>
      <p>Stock disponible: {stock}</p>
      <button
        disabled={count === 0 || count > stock}
        onClick={onAddToCart}
      >
        Comprar
      </button>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default PokemonCount;