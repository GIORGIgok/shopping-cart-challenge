'use client';

import { ApolloProvider } from '@apollo/client';
import { makeClient } from './apollo-client';
import { useMemo } from 'react';

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const client = useMemo(() => makeClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
