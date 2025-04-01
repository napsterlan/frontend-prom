import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClientProvider } from 'react-query';
import queryClient from '../app/queryClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../app/globals.css';
import '../app/font.css';
import { AuthProvider } from '../contexts/AuthContext';
import {SessionProvider} from "next-auth/react";
// import 'bootstrap/dist/css/bootstrap.min.css'
// const protectedPaths = ['/projects/edit', '/projects/add'];

function MyApp({ Component, pageProps }: AppProps) {
//   const isProtectedRoute = protectedPaths.some(path => 
//     router.pathname.startsWith(path)
//   );


  const content = (
      <AuthProvider>
        <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </Head>
          <Header />
            <main className="">
             <Component {...pageProps} />
            </main>
          <Footer />
        </QueryClientProvider>
        </SessionProvider>
      </AuthProvider>


  );

  return content;
}

export default MyApp; 