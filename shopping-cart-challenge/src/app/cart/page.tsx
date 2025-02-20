'use client';

import { FC, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/lib/graphql/queries/queries';
import { Cart } from '@/types/graphql';

const Page: FC = () => {
  const {
    cart,
    setCart,
    loading: contextLoading,
    error: contextError,
  } = useCart();
  const { data, loading, error } = useQuery<{ getCart: Cart }>(GET_CART);

  useEffect(() => {
    if (data?.getCart) {
      setCart(data.getCart);
    }
  }, [data, setCart]);

  if (contextLoading || loading) {
    return <p className="text-center text-white">Loading cart...</p>;
  }

  if (contextError || error) {
    return (
      <p className="text-center text-white">
        Error: {contextError?.message || error?.message}
      </p>
    );
  }

  return (
    <main className="h-screen w-full bg-slate-600 p-4">
      <Link
        href="/products"
        className="rounded-lg px-4 py-2 text-gray-200 hover:bg-slate-700"
      >
        {' < '}Back to Products
      </Link>
      <h2 className="mt-2 bg-gradient-to-r from-gray-200 to-green-400 bg-clip-text text-center text-lg font-semibold text-transparent sm:text-2xl">
        Your Cart:
      </h2>

      <div className="mx-auto mt-4 max-w-xl rounded-lg bg-gray-700 p-4 shadow-lg">
        {cart?.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b border-gray-600 py-2"
          >
            <div className="text-white">
              <h3 className="font-medium">{item.product.title}</h3>
              <p>Price: ${item.product.cost}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Quantity: {item.quantity}</span>
            </div>
          </div>
        ))}

        <div className="mt-4 text-right text-lg font-bold text-white">
          Total: $
          {cart?.items
            .reduce((sum, item) => sum + item.quantity * item.product.cost, 0)
            .toFixed(2)}
        </div>
      </div>
    </main>
  );
};

export default Page;
