import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../index';
import './checkout.css';
const Checkout = () => {
    const [pedidoId, setPedidoId] = useState("");
    const { carrito, clearCart, precioTotal } = useContext(CartContext);
    const { register, handleSubmit } = useForm();

    const comprar = (data) => {
        const pedido = {
            cliente: data,
            productos: carrito,
            total: precioTotal()
        }

        const pedidosRef = collection(db, "pedidos");

        addDoc(pedidosRef, pedido)
            .then((doc) => {
                setPedidoId(doc.id);
                clearCart();
            })
    }

    if (pedidoId) {
        return (
            <div className="centered-container">
                <h1 className="main-title">Muchas gracias por tu compra</h1>
                <p>Tu número de pedido es: {pedidoId}</p>
            </div>
        )
    }

    return (
        <div className="centered-container">
            <h1 className="main-title">Finalizar compra</h1>
            <form className="form-container" onSubmit={handleSubmit(comprar)}>
                <input className="input-field" type="text" placeholder="Ingresá tu nombre" {...register("nombre")} />
                <input className="input-field" type="email" placeholder="Ingresá tu e-mail" {...register("email")} />
                <input className="input-field" type="phone" placeholder="Ingresá tu teléfono" {...register("telefono")} />
                <button className="submit-button" type="submit">Comprar</button>
            </form>
        </div>
    )
}

export default Checkout;