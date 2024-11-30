import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Breadcrumb } from '@/types/types';

export const Breadcrumbs = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const router = useRouter();

  useEffect(() => {
    const updateBreadcrumbs = () => {
      const savedBreadcrumbs = sessionStorage.getItem('breadcrumbs');
      if (savedBreadcrumbs) {
        try {
          const parsed = JSON.parse(savedBreadcrumbs);
          setBreadcrumbs(parsed);
        } catch (e) {
          console.error('Ошибка при парсинге breadcrumbs:', e);
          setBreadcrumbs([]);
        }
      }
    };

    updateBreadcrumbs();
    router.events.on('routeChangeComplete', updateBreadcrumbs);

    return () => {
      router.events.off('routeChangeComplete', updateBreadcrumbs);
    };
  }, [router]);

  const handleCrumbClick = (crumb: Breadcrumb, index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
    setBreadcrumbs(newBreadcrumbs);
    router.push(crumb.href);
  };

  return (
    <nav className="flex gap-2 py-4">
      <Link href="/" className="hover:text-gray-600">
        Главная
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <span>/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-500">{crumb.label}</span>
          ) : (
            <span 
              className="hover:text-gray-600 cursor-pointer"
              onClick={() => handleCrumbClick(crumb, index)}
            >
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}; 