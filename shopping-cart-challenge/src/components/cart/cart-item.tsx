import { FC } from 'react';
import { CartItem as CartItemType } from '@/types/graphql';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: FC<CartItemProps> = ({ item }) => {
  return (
    <article
      key={item._id}
      className="flex items-center justify-between border-b border-gray-600 py-2"
    >
      <div className="pr-4 text-white sm:pr-0">
        <h3 className="text-sm font-semibold text-indigo-200 md:text-base">
          {item.product.title}
        </h3>
        <span className="text-sm font-semibold text-purple-200 md:text-base">
          Price:{' '}
        </span>
        <span className="text-sm sm:text-base">
          {'$'}
          {item.product.cost}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-semibold text-purple-200 md:text-base">
          Quantity:{' '}
        </span>
        <span className="text-white">{item.quantity}</span>
      </div>
    </article>
  );
};

export default CartItem;
