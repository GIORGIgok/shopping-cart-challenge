'use client';

import { HttpLink, ApolloLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support';
import { parseCookies } from 'nookies';

function makeClient() {
  const authMiddleware = new ApolloLink((operation, forward) => {
    // getting the token on client
    const { visitor_token: token } = parseCookies();
    // console.log('Apollo client token:', token);

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }));
    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: {
      cache: 'no-store',
      credentials: 'include',
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authMiddleware, httpLink]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
