'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_CART } from '@/lib/graphql/queries/queries';
import { ADD_ITEM } from '@/lib/graphql/mutations/mutations';
import { Cart, Product } from '@/types/graphql';
import { parseCookies } from 'nookies';

interface CartContextType {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  addToCart: (product: Product) => void;
  loading: boolean;
  error: Error | null;
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

  const [addProductToCart, { loading: mutationLoading, error: mutationError }] =
    useMutation(ADD_ITEM, {
      onCompleted: (data) => {
        setCart(data.addToCart);
        refetch();
      },
      onError: (err) => {
        console.error('Error adding to cart:', err);
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

  const addToCart = (product: Product) => {
    const existingItem = cart?.items.find(
      (item) => item.product._id === product._id,
    );

    if (existingItem) {
      alert('This product is already in your cart!');
    } else {
      addProductToCart({
        variables: {
          input: {
            productId: product._id,
            quantity: 1,
          },
        },
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        loading: queryLoading || mutationLoading,
        error: queryError || mutationError || error,
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
