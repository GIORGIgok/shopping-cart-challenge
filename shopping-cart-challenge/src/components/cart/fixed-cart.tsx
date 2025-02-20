'use client';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';

export default function FixedCart() {
  const { cart } = useCart();

  const totalItems = cart?.items.length;

  return (
    <Link href="/cart">
      <div className="fixed right-2 top-2 z-10 flex h-[80px] w-[80px] flex-col items-center justify-center rounded-full bg-gray-300 shadow-xl outline-8 md:hover:cursor-pointer">
        <span className="text-sm font-bold text-blue-950">In cart:</span>
        <span className="font-bold text-green-600">{totalItems}</span>
      </div>
    </Link>
  );
}
