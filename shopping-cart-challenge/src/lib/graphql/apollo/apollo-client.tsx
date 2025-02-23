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

  // Only create WebSocket link if window is defined (client-side)
  const wsLink =
    typeof window !== 'undefined'
      ? new GraphQLWsLink(
          createClient({
            url:
              process.env.NEXT_PUBLIC_SOCKET_URL ||
              process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') ||
              '',
            connectionParams: {
              authToken: token ? `Bearer ${token}` : '',
            },
          }),
        )
      : null;

  // Modify split logic to account for null wsLink
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
