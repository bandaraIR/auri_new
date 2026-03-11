// CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.selectedSize === action.payload.selectedSize && 
        item.selectedColor === action.payload.selectedColor
      );

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id && 
          item.selectedSize === action.payload.selectedSize && 
          item.selectedColor === action.payload.selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('shoppingCart', JSON.stringify(updatedItems));
        }
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('shoppingCart', JSON.stringify(newItems));
        }
        
        return {
          ...state,
          items: newItems
        };
      }

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => 
        !(item.id === action.payload.id && 
          item.selectedSize === action.payload.selectedSize && 
          item.selectedColor === action.payload.selectedColor)
      );
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('shoppingCart', JSON.stringify(filteredItems));
      }
      
      return {
        ...state,
        items: filteredItems
      };

    case 'UPDATE_QUANTITY':
      const quantityUpdatedItems = state.items.map(item =>
        item.id === action.payload.id && 
        item.selectedSize === action.payload.selectedSize && 
        item.selectedColor === action.payload.selectedColor
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('shoppingCart', JSON.stringify(quantityUpdatedItems));
      }
      
      return {
        ...state,
        items: quantityUpdatedItems
      };

    case 'CLEAR_CART':
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shoppingCart');
      }
      
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  const updateQuantity = (product, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { ...product, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '').replace(',', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const isInCart = (productId, size, color) => {
    return state.items.some(item => 
      item.id === productId && 
      item.selectedSize === size && 
      item.selectedColor === color
    );
  };

  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};