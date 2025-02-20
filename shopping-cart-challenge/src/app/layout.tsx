import './globals.css';
import { PropsWithChildren } from 'react';
import { ApolloWrapper } from './apolloWrapper';
import { CartProvider } from '@/contexts/cart-context';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ApolloWrapper>
          <CartProvider>{children}</CartProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
