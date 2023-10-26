import React, { createContext, useState } from "react";

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

  return (
    <CartContext.Provider value={{ carrito, addCart }}>
      {children}
    </CartContext.Provider>
  );
};