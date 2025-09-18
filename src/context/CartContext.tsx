import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  sellerId: string | null;
  addToCart: (item: CartItem, sellerId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void; // New function
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sellerId, setSellerId] = useState<string | null>(null);

  const addToCart = (item: CartItem, currentSellerId: string) => {
    if (sellerId && sellerId !== currentSellerId) {
        toast({
            title: "Cannot mix sellers",
            description: "You can only order from one seller at a time. Your cart has been cleared.",
            variant: "destructive"
        });
        setCartItems([{ ...item, quantity: 1 }]);
        setSellerId(currentSellerId);
        return;
    }
    
    setSellerId(currentSellerId);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };
  
  const updateItemQuantity = (itemId: string, quantity: number) => {
      if (quantity <= 0) {
          removeFromCart(itemId);
          return;
      }
      setCartItems(prevItems =>
        prevItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        )
      );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  const clearCart = () => {
      setCartItems([]);
      setSellerId(null);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        sellerId,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
