'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import CartItem from '@/components/cart/cart-item';

export default function CartPage() {
  const { cart, loading: contextLoading, error: contextError } = useCart();

  if (contextLoading) {
    <article className="flex h-screen min-h-screen w-full items-center justify-center bg-slate-600">
      <p className="text-center text-white">Loading cart...</p>;
    </article>;
  }

  if (contextError) {
    return (
      <p className="text-center text-white">Error: {contextError?.message}</p>
    );
  }

  let notItems = cart?.items.length === 0;
  let itemsInCart = cart?.items.length;

  return (
    <section className="h-auto min-h-screen w-full bg-slate-600 p-4">
      <Link
        href="/products"
        className="rounded-lg bg-slate-500 px-4 py-2 text-gray-200 transition-colors duration-150 hover:bg-slate-700"
      >
        {' < '}Back to Products
      </Link>
      <h2 className="mt-2 bg-gradient-to-r from-gray-200 to-green-400 bg-clip-text text-center text-lg font-semibold text-transparent sm:text-2xl">
        {notItems
          ? 'Your cart:'
          : `You have ${itemsInCart} item(s) in your cart.`}
      </h2>

      <main className="mx-auto mt-4 max-w-xl rounded-lg bg-gray-700 p-4 shadow-lg">
        {notItems && (
          <p className="text-center text-white">Your cart is empty.</p>
        )}
        {cart?.items.map((item) => <CartItem key={item._id} item={item} />)}

        <div className="mt-4 text-right text-lg font-bold text-green-200">
          Total: $
          {cart?.items
            .reduce((sum, item) => sum + item.quantity * item.product.cost, 0)
            .toFixed(2)}
        </div>
      </main>
    </section>
  );
}
