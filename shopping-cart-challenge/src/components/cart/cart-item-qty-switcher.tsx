import {
  REMOVE_ITEM,
  UPDATE_ITEM_QUANTITY,
} from '@/lib/graphql/mutations/mutations';
import { GET_CART } from '@/lib/graphql/queries/queries';
import { CartItem } from '@/types/graphql';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

interface CartItemProps {
  cartItemProps: CartItem;
}

const CartItemQtySwitcher: FC<CartItemProps> = ({ cartItemProps }) => {
  const [updateQuantity] = useMutation(UPDATE_ITEM_QUANTITY, {
    update(cache, { data }) {
      const existingCart = cache.readQuery({ query: GET_CART });

      if (!existingCart || !data?.updateCartItem) return;

      cache.writeQuery({
        query: GET_CART,
        data: { getCart: data.updateCartItem },
      });
    },
    onError(error) {
      console.error(error);
    },
  });

  const [removeItem] = useMutation(REMOVE_ITEM, {
    update(cache, { data }) {
      const existingCart = cache.readQuery({ query: GET_CART });

      if (!existingCart || !data?.removeCartItem) return;

      cache.writeQuery({
        query: GET_CART,
        data: { getCart: data.removeCartItem },
      });
    },
    onError(error) {
      console.error(error);
    },
  });

  const decreaseQuantityOrRemove = () => {
    if (cartItemProps.quantity === 1) {
      removeItem({ variables: { input: { cartItemId: cartItemProps._id } } });
    } else {
      updateQuantity({
        variables: {
          input: {
            cartItemId: cartItemProps._id,
            quantity: cartItemProps.quantity - 1,
          },
        },
      });
    }
  };

  const increaseQuantity = () => {
    if (cartItemProps.quantity >= cartItemProps.product.availableQuantity)
      return;

    updateQuantity({
      variables: {
        input: {
          cartItemId: cartItemProps._id,
          quantity: cartItemProps.quantity + 1,
        },
      },
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={decreaseQuantityOrRemove}
        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700"
      >
        -
      </button>
      <span className="text-white">{cartItemProps.quantity}</span>
      <button
        onClick={increaseQuantity}
        className={`rounded bg-green-500 px-3 py-1 text-white hover:bg-green-700 ${cartItemProps.quantity >= cartItemProps.product.availableQuantity ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        +
      </button>
    </div>
  );
};

export default CartItemQtySwitcher;
