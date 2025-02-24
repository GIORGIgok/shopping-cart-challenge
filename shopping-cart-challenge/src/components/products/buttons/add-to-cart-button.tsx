'use client';

import { useCart } from '@/contexts/cart-context';
import { Product } from '@/types/graphql';
import { useState, useCallback } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();

  const [isInCart, setIsInCart] = useState<boolean>(
    cart?.items.some((item) => item.product._id === product._id) || false,
  );

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    setIsInCart(true);
  }, [addToCart, product]);

  let buttonText = '';
  let buttonStyle = '';
  let isDisabled = false;

  if (product.availableQuantity === 0) {
    buttonText = 'Not Available';
    buttonStyle = 'bg-gray-500 opacity-50';
    isDisabled = true;
  } else if (isInCart) {
    buttonText = 'Already in Cart';
    buttonStyle = 'bg-blue-600 opacity-70';
    isDisabled = true;
  } else {
    buttonText = 'Add to Cart';
    buttonStyle = 'bg-green-700 hover:bg-green-600';
  }

  return (
    <button
      disabled={isDisabled}
      className={`mt-2 rounded px-4 py-2 text-sm font-bold text-white ${buttonStyle}`}
      onClick={!isDisabled ? handleAddToCart : undefined}
    >
      {buttonText}
    </button>
  );
}
