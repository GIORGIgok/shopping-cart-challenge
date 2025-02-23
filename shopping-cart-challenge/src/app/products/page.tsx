'use client';

import { useQuery } from '@apollo/client';
import ProductItem from '@/components/products/product-item';
import { Product } from '@/types/graphql';
import FixedCart from '@/components/cart/fixed-cart';
import { GET_PRODUCTS } from '@/lib/graphql/queries/queries';
import { parseCookies } from 'nookies';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) {
    return (
      <section className="relative min-h-screen w-full bg-slate-600 p-4">
        <FixedCart />
        <h2 className="my-4 bg-gradient-to-r from-gray-200 to-violet-500 bg-clip-text text-center text-lg font-semibold text-transparent sm:text-2xl">
          Our Products:
        </h2>

        <main className="flex h-[320px] w-full flex-wrap items-center justify-center gap-6">
          <p className="text-center text-white">Loading products...</p>
        </main>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-slate-600">
        <p className="text-white">Error: {error.message}</p>
        <Link href="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen w-full bg-slate-600 p-4">
      <FixedCart />
      <h2 className="my-4 bg-gradient-to-r from-gray-200 to-violet-500 bg-clip-text text-center text-lg font-semibold text-transparent sm:text-2xl">
        Our Products:
      </h2>

      <main className="flex w-full flex-wrap items-center justify-center gap-6">
        {data?.getProducts?.products?.map((item: Product) => (
          <ProductItem key={item._id} productProps={item} />
        ))}
      </main>
    </section>
  );
}
