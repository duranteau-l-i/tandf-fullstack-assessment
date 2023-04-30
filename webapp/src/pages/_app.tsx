import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import Navigation from '@/components/Navigation';
import { useApollo } from '@/graphql/apollo';
import theme from '@/theme';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo({});

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider resetCSS theme={theme}>
        <Navigation
          heading='Booker App'
          items={[
            {
              label: 'Items',
              href: '/items',
            },
            {
              label: 'Appointments',
              href: '/appointments',
            },
          ]}
        />
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
