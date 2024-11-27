import { ReactNode } from 'react';
import { QueryClientProvider } from 'react-query';
import queryClient from './queryClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../app/globals.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="container mx-auto">{children}</main>
      <Footer />
    </QueryClientProvider>
  );
}
