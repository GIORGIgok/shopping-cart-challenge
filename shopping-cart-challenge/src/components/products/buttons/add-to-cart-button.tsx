'use client';

import { useMutation, useQuery } from '@apollo/client';
import { GET_CART } from '@/lib/graphql/queries/queries';
import { Product } from '@/types/graphql';
import { useState, useEffect } from 'react';
import { cartAddItemSchema } from '@/lib/utils/validation';
import { ADD_ITEM } from '@/lib/graphql/mutations/mutations';

export default function AddToCartButton({ product }: { product: Product }) {
  const { data } = useQuery(GET_CART);
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (data?.getCart?.items) {
      const productInCart = data.getCart.items.some(
        (item: { product: { _id: string } }) =>
          item.product._id === product._id,
      );
      setIsInCart(productInCart);
    }
  }, [data, product._id]);

  const [addToCart, { loading }] = useMutation(ADD_ITEM, {
    update(cache, { data }) {
      if (!data?.addToCart) return;

      cache.writeQuery({
        query: GET_CART,
        data: { getCart: data.addToCart },
      });

      setIsInCart(true);
      setIsDisabled(true);
    },
    onError(error) {
      console.error(error);
      setError('Failed to add item to cart');
      setIsDisabled(false);
    },
  });

  const handleAddToCart = async () => {
    setError(null);
    setIsDisabled(true);

    const validation = cartAddItemSchema.safeParse({
      productId: product._id,
      quantity: 1,
    });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsDisabled(false);
      return;
    }

    await addToCart({
      variables: { input: validation.data },
    });
  };

  let buttonText = loading ? 'Adding...' : 'Add to Cart';
  let buttonStyle = 'bg-green-700 hover:bg-green-600';

  useEffect(() => {
    if (product.availableQuantity === 0 || isInCart) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [product.availableQuantity, isInCart]);

  if (product.availableQuantity === 0) {
    buttonText = 'Not Available';
    buttonStyle = 'bg-gray-500 opacity-50';
  } else if (isInCart) {
    buttonText = 'Already in Cart';
    buttonStyle = 'bg-blue-600 opacity-50';
  }

  return (
    <div>
      <button
        disabled={isDisabled}
        className={`mt-2 rounded px-4 py-2 text-sm font-bold text-white ${buttonStyle}`}
        onClick={!isDisabled ? handleAddToCart : undefined}
      >
        {buttonText}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
