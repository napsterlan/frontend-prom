import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Отключаем ретраи для SSR
        retry: false,
        // Отключаем рефетч при фокусе для SSR
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp; // инициатива ИИ