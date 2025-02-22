import { Product } from '@/types/graphql';
import AddToCartButton from './add-to-cart-button';
import { formatDate } from '../../lib/utils/date-formatter';

export default async function ProductItem({
  productProps,
}: {
  productProps: Product;
}) {
  return (
    <article className="h-full w-full max-w-[320px] rounded-md bg-slate-400 p-4 transition duration-[0.8s] md:cursor-pointer md:hover:scale-105">
      <h3 className="font-bold text-slate-800">{productProps.title}</h3>
      <div className="border-t-2 border-slate-500">
        <span className="font-semibold text-slate-600">Price: </span>
        <span className="text-slate-800">{productProps.cost}</span>
      </div>
      <div>
        <span className="font-semibold text-slate-600">In-stock: </span>
        <span className="text-slate-800">{productProps.availableQuantity}</span>
      </div>
      <div>
        <span className="text-xs font-semibold text-slate-600">Created: </span>
        <p className="text-sm text-blue-900">
          {formatDate(productProps.createdAt)}
        </p>
        <span className="text-xs font-semibold text-slate-600">Updated: </span>
        <p className="text-sm text-blue-900">
          {formatDate(productProps.updatedAt)}
        </p>
      </div>

      <AddToCartButton product={productProps} />
    </article>
  );
}
