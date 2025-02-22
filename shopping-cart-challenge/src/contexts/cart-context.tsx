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
import { cartAddItemSchema } from '@/lib/utils/validation';

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
    fetchPolicy: 'network-only',
    onError: (err) => {
      console.error('Error fetching cart:', err);
      setError(err);
    },
  });

  const addToCart = (product: Product) => {
    const existingItem = cart?.items.find(
      (item) => item.product._id === product._id,
    );

    if (existingItem) {
      alert('This product is already in your cart!');
      return;
    }

    const validation = cartAddItemSchema.safeParse({
      productId: product._id,
      quantity: 1,
    });

    if (!validation.success) {
      console.error('Validation error:', validation.error.format());
      return;
    }

    addProductToCart({
      variables: {
        input: {
          productId: product._id,
          quantity: 1,
        },
      },
    });
  };

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
      if (!data?.data?.cartItemUpdate) return;

      const { event, payload } = data.data.cartItemUpdate;
      //   console.log("event from ondata =>", event);
      //   console.log("payload from ondata =>", payload);

      setCart((prevCart) => {
        if (!prevCart) return prevCart;

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
      });
    },
  });

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
