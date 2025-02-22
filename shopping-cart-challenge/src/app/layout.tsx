import './globals.css';
import { PropsWithChildren } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { ApolloWrapper } from '@/lib/graphql/apollo/apollo-provider';

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
