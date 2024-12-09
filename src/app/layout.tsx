"use client";

import { ReactNode, Fragment } from 'react';
import { QueryClientProvider } from 'react-query';
import queryClient from './queryClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../app/globals.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
        <QueryClientProvider client={queryClient}>
          <Fragment>
            <Header />
            <main className="max-w-[1200px] mx-auto px-4">{children}</main>
            <Footer />
          </Fragment>
        </QueryClientProvider>
  );
}
