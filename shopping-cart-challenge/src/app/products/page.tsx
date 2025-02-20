import { cookies } from 'next/headers';
import { print } from 'graphql/language/printer';
import { GET_PRODUCTS } from '@/lib/graphql/queries/queries';
import ProductItem from '@/components/products/product-item';
import { Product } from '@/types/graphql';
import FixedCart from '@/components/cart/fixed-cart';

async function fetchData(visitorToken: string) {
  const query = print(GET_PRODUCTS);

  const response = await fetch('https://take-home-be.onrender.com/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${visitorToken}`,
    },
    body: JSON.stringify({
      query,
    }),
  });

  const { data } = await response.json();
  return data;
}

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('visitor_token')?.value;

  if (!token) {
    return <div>Please log in to view products and cart.</div>;
  }

  const data = await fetchData(token);

  return (
    <section className="relative w-full bg-slate-600 p-4">
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
