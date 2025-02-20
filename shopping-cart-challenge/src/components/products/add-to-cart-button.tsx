'use client';

import { useCart } from '@/contexts/cart-context';
import { Product } from '@/types/graphql';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, loading } = useCart();

  const handleAddToCart = () => [addToCart(product)];

  return (
    <button
      disabled={product.availableQuantity === 0 || loading}
      className={`mt-2 rounded bg-green-700 px-4 py-2 text-sm font-bold text-white transition duration-300 hover:bg-green-600 ${
        product.availableQuantity === 0 && 'cursor-not-allowed opacity-50'
      }, ${loading && 'cursor-wait opacity-50'}`}
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
}
