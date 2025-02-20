import { Product } from '@/types/graphql';

export default async function ProductItem({
  productProps,
}: {
  productProps: Product;
}) {
  return (
    <article className="h-full w-full max-w-[320px] rounded-md bg-slate-400 p-4 transition duration-[0.8s] md:cursor-pointer md:hover:scale-105">
      <h3 className="font-bold">{productProps.title}</h3>
      <div>
        <span className="font-semibold">Price: </span>
        <span>{productProps.cost}</span>
      </div>
      <div>
        <span className="font-semibold">Qty: </span>
        <span>{productProps.availableQuantity}</span>
      </div>
      <p className="text-sm text-blue-900">{productProps.createdAt}</p>
      <p className="text-sm text-blue-900">{productProps.updatedAt}</p>

      <button className="mt-2 rounded bg-green-700 px-4 py-2 text-sm font-bold text-white transition duration-300 hover:bg-green-600">
        Add to Cart
      </button>
    </article>
  );
}
