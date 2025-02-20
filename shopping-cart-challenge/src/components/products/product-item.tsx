import { Product } from '@/types/graphql';
import AddToCartButton from './add-to-cart-button';

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

      <AddToCartButton product={productProps} />
    </article>
  );
}
