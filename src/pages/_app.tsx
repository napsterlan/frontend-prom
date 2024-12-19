import type { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import queryClient from '../app/queryClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../app/globals.css';
import '../app/font.css';

const protectedPaths = ['/projects/edit', '/projects/add'];

function MyApp({ Component, pageProps, router }: AppProps) {
  const isProtectedRoute = protectedPaths.some(path => 
    router.pathname.startsWith(path)
  );


  const content = (
    <QueryClientProvider client={queryClient}>
      <Header />
        <main className="">
         <Component {...pageProps} />
        </main>
      <Footer />
    </QueryClientProvider>
      

  );

  return content;
}

export default MyApp; 