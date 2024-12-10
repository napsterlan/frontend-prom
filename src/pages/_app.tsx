import type { AppProps } from 'next/app';
import Layout from '@/app/layout';

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

  return content;
}

export default MyApp; 