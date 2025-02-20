import { cookies } from 'next/headers';
import { print } from 'graphql/language/printer';
import { GET_PRODUCTS } from '@/lib/graphql/queries/queries';

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
    <>
      {data?.getProducts?.products?.map((item: any) => (
        <div key={item._id}>
          <h2>{item.title}</h2>
          <p>{item.cost}</p>
          <p>{item.availableQuantity}</p>
        </div>
      ))}
    </>
  );
}
