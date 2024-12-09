import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import { Fragment } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Fragment>
      <div className="min-h-screen flex flex-col">
        <AdminPanel />
        <Header />
        <main className="max-w-[1200px] mx-auto px-4">{children}</main>
        <Footer />
      </div>
    </Fragment>
  );
} 