'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import CartItem from '@/components/cart/cart-item';
import CartNotifierSubscriptionModal from '@/components/cart/cart-notifier-sub-modal';

export default function CartPage() {
  const { cart } = useCart();

  let notItems: boolean = cart?.items.length === 0;
  let itemsInCart: number = cart?.items.length || 0;

  return (
    <section className="relative h-auto min-h-screen w-full bg-slate-600 p-4">
      <CartNotifierSubscriptionModal />
      <Link
        href="/products"
        className="rounded-lg bg-slate-700 px-4 py-2 text-gray-200 transition-colors duration-150 hover:bg-slate-400 hover:text-slate-700"
      >
        {' < '}Back to Products
      </Link>
      <h2 className="mt-2 bg-gradient-to-r from-gray-200 to-green-400 bg-clip-text text-center text-lg font-semibold text-transparent sm:text-2xl">
        {notItems
          ? 'Your cart:'
          : `You have ${itemsInCart} item(s) in your cart.`}
      </h2>

      <main className="mx-auto mt-4 max-w-xl rounded-lg border-2 border-slate-400 bg-gray-700 p-4 shadow-lg">
        {notItems && (
          <p className="my-5 text-center text-white">Cart is empty.</p>
        )}
        {cart?.items.map((item) => <CartItem key={item._id} item={item} />)}

        <div className="mt-4 text-right text-sm font-bold text-green-200 sm:text-lg">
          Total: $
          {cart?.items
            .reduce((sum, item) => sum + item.quantity * item.product.cost, 0)
            .toFixed(2)}
        </div>
      </main>
    </section>
  );
}
