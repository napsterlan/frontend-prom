import type { AppProps } from 'next/app';
import Layout from '@/app/layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const protectedPaths = ['/projects/edit', '/projects/add'];

function MyApp({ Component, pageProps, router }: AppProps) {
  const isProtectedRoute = protectedPaths.some(path => 
    router.pathname.startsWith(path)
  );

  const content = (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  if (isProtectedRoute) {
    return <ProtectedRoute>{content}</ProtectedRoute>;
  }

  return content;
}

export default MyApp; 