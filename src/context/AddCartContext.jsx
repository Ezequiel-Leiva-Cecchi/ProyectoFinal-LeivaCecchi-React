import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const Items = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Definir la función addCart
  const addCart = (item) => {
    // Agregar lógica para añadir el artículo al carrito, por ejemplo:
    setCarrito([...carrito, item]);
  };

  return (
    <CartContext.Provider value={{ carrito, setCarrito, addCart }}>
      {children}
    </CartContext.Provider>
  );
}