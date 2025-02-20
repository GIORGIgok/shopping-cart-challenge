'use client';
import { ADD_ITEM } from '@/lib/graphql/mutations/mutations';
import { useMutation } from '@apollo/client';

export default function AddToCartButton({ productId }: { productId: string }) {
  const [addToCart] = useMutation(ADD_ITEM, {
    onCompleted: (data) => {
      console.log('Product added to cart:', data);
    },
    onError: (error) => {
      console.error('Error adding product to cart:', error);
    },
  });

  const handleAddToCart = () => {
    console.log('Adding product to cart with ID:', productId); // Check the productId
    console.log('Variables:', { productId, quantity: 1 }); // Check this
    addToCart({
      variables: {
        productId,
        quantity: 1,
      },
    });
  };

  return (
    <button
      className="mt-2 rounded bg-green-700 px-4 py-2 text-sm font-bold text-white transition duration-300 hover:bg-green-600"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
}
