'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '@/lib/graphql/mutations/mutations';
import { setVisitorToken } from '@/lib/auth/auth';
import { parseCookies } from 'nookies';

const MainPageWelcome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const [registerUser] = useMutation(REGISTER);

  useEffect(() => {
    const { visitor_token: token } = parseCookies();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);

    try {
      const { data } = await registerUser();

      if (data?.register?.token) {
        setVisitorToken(data.register.token);
        window.location.href = '/products';
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
      {isAuthenticated ? (
        <div className="text-center">
          <h2 className="font-base rounded-xl bg-slate-700 px-4 py-2 text-sm text-green-500 sm:text-lg">
            You are already signed in.
          </h2>
          <button
            className="mt-4 rounded bg-blue-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
            onClick={() => router.push('/products')}
          >
            Go to Products
          </button>
        </div>
      ) : (
        <button
          className="rounded bg-green-700 px-4 py-2 font-bold text-white transition duration-300 hover:bg-green-600"
          onClick={handleSignUp}
          disabled={isLoading}
        >
          <span className="flex items-center justify-center">
            {isLoading ? 'Signing up...' : 'Sign up in seconds!'}
          </span>
        </button>
      )}
    </div>
  );
};

export default MainPageWelcome;
