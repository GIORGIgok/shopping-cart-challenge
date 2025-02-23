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
import { CART_ITEM_UPDATE } from '@/lib/graphql/subscriptions/subscriptions';

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
        // console.log('Cart updated:', data);
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

  useSubscription(CART_ITEM_UPDATE, {
    onData: ({ data }) => {
      console.log('Raw subscription data:', data);
      if (!data?.data?.cartItemUpdate) {
        console.log('No cart update data received');
        return;
      }

      const { event, payload } = data.data.cartItemUpdate;
      console.log('Processing event:', event);
      console.log('With payload:', payload);

      setCart((prevCart) => {
        if (!prevCart) {
          console.log('No previous cart state');
          return prevCart;
        }

        const newCart = (() => {
          switch (event) {
            case 'ITEM_OUT_OF_STOCK':
              return {
                ...prevCart,
                items: prevCart.items.filter(
                  (item) => item.product._id !== payload._id,
                ),
              };
            case 'ITEM_QUANTITY_UPDATED':
              return {
                ...prevCart,
                items: prevCart.items.map((item) =>
                  item.product._id === payload._id
                    ? { ...item, quantity: payload.quantity }
                    : item,
                ),
              };
            default:
              return prevCart;
          }
        })();

        console.log('Updated cart state:', newCart);
        return newCart;
      });
    },
  });

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
