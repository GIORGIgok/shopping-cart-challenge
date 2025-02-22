'use client';

import { HttpLink, ApolloLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support';
import { parseCookies } from 'nookies';

export function makeClient() {
  const authMiddleware = new ApolloLink((operation, forward) => {
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
      cache: 'no-cache',
      credentials: 'include',
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authMiddleware, httpLink]),
  });
}
