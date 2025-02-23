import { FC } from 'react';
import { CartItem as CartItemType } from '@/types/graphql';
import CartItemQtySwitcher from './cart-item-qty-switcher';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: FC<CartItemProps> = ({ item }) => {
  return (
    <article
      key={item._id}
      className="flex items-center justify-between border-b border-gray-600 py-2 hover:md:bg-slate-700"
    >
      <div className="w-[340px] max-w-full pr-4 text-white sm:pr-0">
        <h3 className="text-sm font-semibold text-indigo-200 md:text-base">
          {item.product.title}
        </h3>
        <p>
          <span className="text-sm font-semibold text-purple-200 md:text-base">
            Price:{' '}
          </span>
          <span className="text-sm sm:text-base">
            {'$'}
            {item.product.cost}
          </span>
        </p>
        <p>
          <span className="text-sm font-semibold text-orange-200">
            In stock:{' '}
          </span>
          <span className="text-sm">{item.product.availableQuantity}</span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="mr-1 text-xs font-semibold text-purple-200 sm:mr-0 sm:text-sm md:text-base">
          Quantity:{' '}
        </span>
      </div>

      <CartItemQtySwitcher cartItemProps={item} />
    </article>
  );
};

export default CartItem;
