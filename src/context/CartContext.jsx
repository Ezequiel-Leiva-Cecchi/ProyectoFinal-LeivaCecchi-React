import React, { createContext, useState } from 'react';
import Swal from 'sweetalert2';

export const CartContext = createContext();

export const Items = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const addCart = (item) => {
    if (carrito.length < 10) {
      setCarrito((prevCarrito) => {
        const existingItemIndex = prevCarrito.findIndex((pokemon) => pokemon.id === item.id);

        if (existingItemIndex !== -1) {
          const updatedCarrito = [...prevCarrito];
          updatedCarrito[existingItemIndex] = {
            ...updatedCarrito[existingItemIndex],
            cantidad: updatedCarrito[existingItemIndex].cantidad + item.cantidad,
          };
          return updatedCarrito;
        } else {
          return [...prevCarrito, { ...item, cantidad: item.cantidad }];
        }
      });
    } else {
      Swal.fire('Límite alcanzado', 'No puedes agregar más de 10 elementos al carrito.', 'error');
    }
  };

  const precioTotal = () => {
    return carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  };

  const clearItem = (item) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        setCarrito((prevCarrito) => prevCarrito.filter((pokemon) => pokemon.id !== item.id));
        Swal.fire('Eliminado', 'Tu artículo fue removido exitosamente.', 'success');
      } else {
        Swal.fire('Cancelado', 'La acción ha sido cancelada.', 'error');
      }
    });
  };

  const clearCart = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider value={{ carrito, addCart, clearItem, clearCart, precioTotal }}>
      {children}
    </CartContext.Provider>
  );
};