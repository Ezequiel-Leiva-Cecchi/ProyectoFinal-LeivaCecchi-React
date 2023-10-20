import React, {createContext, useState } from "react";

export const CartContext = createContext();

export const Items = ({ children }) =>{
    const [carrito, setCarrito] = useState([])
    return(
        <CartContext.Provider value={{carrito,setCarrito}}>
          {children}
        </CartContext.Provider>
    )

}