'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CART } from '@/lib/graphql/queries/queries';
import { Cart, Product } from '@/types/graphql';
import { parseCookies } from 'nookies';

interface CartContextType {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { visitor_token: token } = parseCookies();
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_CART, {
    skip: !token,
    onError: (err) => {
      console.error('Error fetching cart:', err);
      setError(err);
    },
  });

  useEffect(() => {
    if (data?.getCart) {
      setCart(data.getCart);
    }

    return () => {
      setCart(null);
    };
  }, [data]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading: queryLoading,
        error: queryError || error,
        refetch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('context not found');
  }
  return context;
};
