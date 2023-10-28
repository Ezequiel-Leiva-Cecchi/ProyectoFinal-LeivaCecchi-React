import React, { createContext, useState } from "react";
import Swal from "sweetalert2";

export const CartContext = createContext();

export const Items = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const addCart = (item) => {
    setCarrito((prevCarrito) => {
      const existingItem = prevCarrito.find((pokemon) => pokemon.id === item.id);

      if (existingItem) {
        return prevCarrito.map((pokemon) =>
          pokemon.id === item.id
            ? { ...pokemon, cantidad: pokemon.cantidad + item.cantidad }
            : pokemon
        );
      } else {
        return [...prevCarrito, item];
      }
    });
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar todo'
    }).then((result) => {
      if (result.isConfirmed) {
        setCarrito([]);
        Swal.fire('Carrito vaciado', 'Tu carrito ha sido vaciado exitosamente.', 'success');
      } else {
        Swal.fire('Cancelado', 'La acción ha sido cancelada.', 'error');
      }
    });
  };

  return (
    <CartContext.Provider value={{ carrito, addCart, clearItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};