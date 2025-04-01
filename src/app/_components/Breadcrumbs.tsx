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
    <nav className="flex gap-2 pt-[2px] px-[15%] justify-end ">
      <div className="text-[14px]">
        <div className="flex gap-2 ml-[10px]">
          <Link href="/public" className="hover:text-gray-600 text-gray-500">
            Главная
          </Link>
          {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <svg data-testid="geist-icon" height="16" stroke-linejoin="round" className="text-gray-500"
                     viewBox="0 0 16 16" width="16">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
                        fill="currentColor"></path>
                </svg>
                {index === breadcrumbs.length - 1 ? (
                    <span className="text-black">{crumb.label}</span>
                ) : (
                    <span
                        className="hover:text-gray-800 text-gray-500 cursor-pointer"
                        onClick={() => handleCrumbClick(crumb, index)}
                    >
                  {crumb.label}
                </span>
                )}
              </div>
          ))}
        </div>
        {/*<div className="h-[3px] w-full bg-[rgb(92,214,156)] [clip-path:polygon(4px_0%,100%_0%,100%_100%,0%_100%)]"/>*/}
      </div>
    </nav>
  );
}; 