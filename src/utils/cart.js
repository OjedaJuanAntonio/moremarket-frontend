// src/utils/cart.js

export const addToCart = (product) => {
    // Obtén el carrito actual del localStorage o un arreglo vacío
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Busca si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // Si existe, incrementa la cantidad
      existingItem.quantity += 1;
    } else {
      // Si no existe, añade el producto con una cantidad inicial de 1
      const cartItem = { ...product, quantity: 1 };
      cart.push(cartItem);
    }
    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  
  export const getCart = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  };
  
  export const removeFromCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  
  export const clearCart = () => {
    localStorage.removeItem("cart");
  };
  