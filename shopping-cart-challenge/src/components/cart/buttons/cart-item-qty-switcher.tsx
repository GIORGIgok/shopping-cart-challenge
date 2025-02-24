import {
  REMOVE_ITEM,
  UPDATE_ITEM_QUANTITY,
} from '@/lib/graphql/mutations/mutations';
import { GET_CART } from '@/lib/graphql/queries/queries';
import {
  cartRemoveItemSchema,
  cartUpdateItemQuantitySchema,
} from '@/lib/utils/validation';
import { CartItem } from '@/types/graphql';
import { useMutation } from '@apollo/client';
import { FC, useState, useRef } from 'react';

interface CartItemProps {
  cartItemProps: CartItem;
}

const CartItemQtySwitcher: FC<CartItemProps> = ({ cartItemProps }) => {
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      setIsLoading(false);
    },
    onCompleted() {
      setIsLoading(false);
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
      setIsLoading(false);
    },
    onCompleted() {
      setIsLoading(false);
    },
  });

  const debounce = (callback: () => void, delay = 300) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  const validateAndDecreaseQuantity = () => {
    if (isLoading) return;

    setIsLoading(true);

    debounce(async () => {
      try {
        if (cartItemProps.quantity === 1) {
          const removeInput = { cartItemId: cartItemProps._id };
          await cartRemoveItemSchema.parseAsync(removeInput);
          removeItem({
            variables: { input: removeInput },
          });
        } else {
          const updateInput = {
            cartItemId: cartItemProps._id,
            quantity: cartItemProps.quantity - 1,
          };
          await cartUpdateItemQuantitySchema.parseAsync(updateInput);
          updateQuantity({
            variables: { input: updateInput },
          });
        }
      } catch (err) {
        console.warn(err);
        setIsLoading(false);
      }
    });
  };

  const validateAndIncreaseQuantity = () => {
    if (isLoading) return;

    setIsLoading(true);

    debounce(async () => {
      try {
        if (cartItemProps.quantity >= cartItemProps.product.availableQuantity) {
          console.warn('Maximum quantity reached');
          setIsLoading(false);
          return;
        }

        const updateInput = {
          cartItemId: cartItemProps._id,
          quantity: cartItemProps.quantity + 1,
        };

        await cartUpdateItemQuantitySchema.parseAsync(updateInput);
        updateQuantity({
          variables: { input: updateInput },
        });
      } catch (err) {
        console.warn(err);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={validateAndDecreaseQuantity}
        disabled={isLoading}
        className={`rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-700 ${
          isLoading ? 'opacity-50' : ''
        }`}
      >
        -
      </button>
      <span className="text-white">{cartItemProps.quantity}</span>
      <button
        onClick={validateAndIncreaseQuantity}
        disabled={
          isLoading ||
          cartItemProps.quantity >= cartItemProps.product.availableQuantity
        }
        className={`rounded-lg bg-green-500 px-3 py-1 text-white hover:bg-green-700 ${
          isLoading ||
          cartItemProps.quantity >= cartItemProps.product.availableQuantity
            ? 'opacity-50'
            : ''
        }`}
      >
        +
      </button>
    </div>
  );
};

export default CartItemQtySwitcher;
