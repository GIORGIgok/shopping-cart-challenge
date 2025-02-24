'use client';

import React, { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import { CART_ITEM_UPDATE } from '@/lib/graphql/subscriptions/subscriptions';
import { CartItemMessage } from '@/types/graphql';
import { useCart } from '@/contexts/cart-context';
import { PRODUCTS_PAGE_PATH } from '@/constants/paths';
import { useRouter } from 'next/navigation';

const CartNotifierSubscriptionModal = () => {
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { refetch } = useCart();

  const { data } = useSubscription<{
    cartItemUpdate: CartItemMessage;
  }>(CART_ITEM_UPDATE, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data) {
      console.log('Received data:', data);
      if (data.cartItemUpdate) {
        const { event, payload } = data.cartItemUpdate;
        console.log('Event:', event, 'Payload:', payload);

        // ITEM_QUANTITY_UPDATED event is not available || I suspect that backend has a bug.
        if (event === 'ITEM_QUANTITY_UPDATED') {
          setModalMessage(
            'Your Items quantity updated due to stock changes. Return to cart?',
          );
          setIsModalVisible(true);
          // ITEM_OUT_OF_STOCK event works FINE.
        } else if (event === 'ITEM_OUT_OF_STOCK') {
          setModalMessage(
            'An item in your cart is out of stock. Return to the cart?',
          );
          setIsModalVisible(true);
        }
      }
    }

    return () => {
      setModalMessage('');
      setIsModalVisible(false);
    };
  }, [data]);

  const handleModalClose = () => {
    refetch();
    setIsModalVisible(false);
  };

  const handleNavigateToProductsPage = () => {
    refetch();
    setIsModalVisible(false);
    router.push(PRODUCTS_PAGE_PATH);
  };

  return (
    <>
      {isModalVisible && (
        <article className="fixed inset-0 z-50 mx-2 flex items-center justify-center bg-gray-700 bg-opacity-50 sm:mx-0">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="yellow"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>

            <h3 className="mb-4 text-lg font-semibold sm:text-xl">
              Cart Update
            </h3>
            <p className="text-sm sm:text-base">{modalMessage}</p>
            <div className="float-right flex max-w-[140px] gap-3">
              <button
                className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
                onClick={handleModalClose}
              >
                Yes
              </button>
              <button
                className="mt-4 rounded-lg bg-red-300 px-4 py-2 text-white"
                onClick={handleNavigateToProductsPage}
              >
                No
              </button>
            </div>
          </div>
        </article>
      )}
    </>
  );
};

export default CartNotifierSubscriptionModal;
