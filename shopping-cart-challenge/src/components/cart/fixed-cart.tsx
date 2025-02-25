'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';

export default function FixedCart() {
  const { cart } = useCart();

  const [localItemCount, setLocalItemCount] = useState<number>(
    cart?.items?.length || 0,
  );

  useEffect(() => {
    if (cart) {
      setLocalItemCount(cart.items.length);
    }
  }, [cart]);

  const totalItems = localItemCount;

  return (
    <Link href="/cart">
      <div className="fixed right-2 top-2 z-10 flex h-[80px] w-[80px] flex-col items-center justify-center rounded-full bg-gray-300 shadow-xl outline-8 md:hover:cursor-pointer">
        <span className="absolute top-6 text-sm font-bold text-blue-950">
          In cart:
        </span>
        <span className="absolute bottom-4 font-bold text-green-600">
          {totalItems}
        </span>
      </div>
    </Link>
  );
}
