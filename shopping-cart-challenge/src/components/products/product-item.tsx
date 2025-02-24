'use client';

import { Product } from '@/types/graphql';
import AddToCartButton from './buttons/add-to-cart-button';
import { formatDate } from '../../lib/utils/date-formatter';

export default function ProductItem({
  productProps,
}: {
  productProps: Product;
}) {
  return (
    <article className="h-full w-full max-w-[320px] rounded-md bg-slate-400 p-4 transition duration-[0.8s] hover:bg-slate-300 md:cursor-pointer md:hover:scale-105">
      <h3 className="font-bold text-slate-800">{productProps.title}</h3>
      <div className="border-t-2 border-slate-500">
        <span className="text-sm font-semibold text-slate-600">Price: </span>
        <span className="text-slate-800">${productProps.cost}</span>
      </div>
      <div>
        <span className="text-sm font-semibold text-slate-600">In-stock: </span>
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

      <div className="w-full text-right">
        <AddToCartButton product={productProps} />
      </div>
    </article>
  );
}
