'use client';

import { ApolloProvider } from '@apollo/client';
import { makeClient } from './apollo-client';

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const client = makeClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
