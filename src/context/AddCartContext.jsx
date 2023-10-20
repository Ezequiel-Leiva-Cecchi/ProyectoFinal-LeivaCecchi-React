import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const Items = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const addCart = (item) => {
    setCarrito([...carrito, item]);
  };

  return (
    <CartContext.Provider value={{ carrito, setCarrito, addCart }}>
      {children}
    </CartContext.Provider>
  );
}