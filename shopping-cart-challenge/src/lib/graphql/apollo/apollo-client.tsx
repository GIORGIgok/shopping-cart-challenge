'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { parseCookies } from 'nookies';

export function makeClient() {
  const { visitor_token: token } = parseCookies();

  const authMiddleware = new ApolloLink((operation, forward) => {
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

  const wsLink =
    typeof window !== 'undefined'
      ? new GraphQLWsLink(
          createClient({
            url:
              process.env.NEXT_PUBLIC_SOCKET_URL ||
              process.env.NEXT_PUBLIC_API_URL?.replace(
                'https://',
                'wss://',
              ).replace('http://', 'ws//') ||
              'wss://take-home-be.onrender.com/api',
            connectionParams: {
              authToken: token || '',
            },
            on: {
              connected: () => console.log('WS Connected'),
              closed: (event) => {
                console.log('WS Closed', event);
              },
              error: (error) => console.error('WS Error:', error),
            },
            shouldRetry: () => true,
            retryAttempts: 3,
            connectionAckWaitTimeout: 8000,
          }),
        )
      : null;

  const splitLink =
    typeof window !== 'undefined' && wsLink
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          wsLink,
          ApolloLink.from([authMiddleware, httpLink]),
        )
      : ApolloLink.from([authMiddleware, httpLink]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  });
}
