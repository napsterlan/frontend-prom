import type { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import queryClient from '../app/queryClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../app/globals.css';

const protectedPaths = ['/projects/edit', '/projects/add'];

function MyApp({ Component, pageProps, router }: AppProps) {
  const isProtectedRoute = protectedPaths.some(path => 
    router.pathname.startsWith(path)
  );

  const content = (
    <QueryClientProvider client={queryClient}>
      <Header />
        <main className="max-w-[1200px] mx-auto px-4">
         <Component {...pageProps} />
        </main>
      <Footer />
    </QueryClientProvider>
      

  );

  return content;
}

export default MyApp; 