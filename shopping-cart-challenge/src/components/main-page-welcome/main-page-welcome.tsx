'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '@/lib/graphql/mutations/mutations'; // Мутация
import { setVisitorToken } from '@/lib/auth/auth'; // Функция для сохранения токена

const MainPageWelcome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [registerUser] = useMutation(REGISTER);

  const handleSignUp = async () => {
    setIsLoading(true);

    try {
      const { data } = await registerUser();

      if (data?.register?.token) {
        setVisitorToken(data.register.token);

        router.push('/products');
      } else {
        console.error('Token not found in the response.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <button
        className="rounded bg-green-700 px-4 py-2 font-bold text-white transition duration-300 hover:bg-green-600"
        onClick={handleSignUp}
        disabled={isLoading}
      >
        <span className="flex items-center justify-center">
          {isLoading ? 'Signing up...' : 'Sign up in seconds!'}
        </span>
      </button>
    </div>
  );
};

export default MainPageWelcome;
