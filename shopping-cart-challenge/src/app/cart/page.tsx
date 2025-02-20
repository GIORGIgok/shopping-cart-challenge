'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_CART } from '@/lib/graphql/queries/queries';
// import { CartItem } from '@/types/graphql';

export default function Page() {
  const { data, loading, error } = useQuery(GET_CART);

  if (loading) return <p className="text-center text-white">Loading cart...</p>;

  if (error)
    return <p className="text-center text-white">Error: {error.message}</p>;

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
        {data.getCart.items.length === 0 ? (
          <p className="text-center text-gray-300">Your cart is empty.</p>
        ) : (
          data.getCart.items.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b border-gray-600 py-2"
            >
              <span className="text-white">
                {item.product.title} - ${item.product.cost}
              </span>
              <span className="text-white">Quantity: {item.quantity}</span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
