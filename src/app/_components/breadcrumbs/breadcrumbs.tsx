'use client';

import { Children, useState, type ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { BreadCrumbsContext } from './breadcrumbs-context';
import Link from 'next/link';
import { Spinner } from './spinner';

const pathTranslations: Record<string, string> = {
    // Common paths
    'home': 'Главная',
    'news': 'Новости',
    'projects': 'Проекты',
    'about': 'О нас',
    'contacts': 'Контакты',
    'services': 'Услуги',
    'login': 'Авторизация',
    'register': 'Регистрация',
    'profile': 'Профиль',
    'admin': 'Администрирование',
    'dashboard': 'Панель управления',
    'settings': 'Настройки',
    
    // Add more translations as needed
  };

function translatePathName(path: string): string {
    // First check if we have an exact translation
    if (pathTranslations[path.toLowerCase()]) {
      return pathTranslations[path.toLowerCase()];
    }
    
    // Try to make it look nicer by capitalizing first letter
    // and replacing dashes/underscores with spaces
    return path.charAt(0).toUpperCase() + 
           path.slice(1).replace(/[-_]/g, ' ');
}

interface IBreadcrumbsContainerProps {
  children: ReactNode;
  separator?: string | ReactNode;
}

interface IBreadcrumbsProps {
  children: ReactNode;
  withHome?: boolean;
}

interface IBreadcrumbItemProps {
  children: ReactNode;
  href: string;
}

const BreadcrumbsItem = ({
  children,
  href,
  ...props
}: IBreadcrumbItemProps) => {
  return (
    <li {...props} className="last:border-solid border-b border-transparent hover:border-PLGreen hover:border-b ">
      <Link href={href} passHref>
      <span className="relative">
          <span className="relative hover:font-semibold">{children}</span>
          <span className="font-semibold invisible absolute left-0 top-0" aria-hidden="true">{children}</span>
        </span>
      </Link>
    </li>
  );
};

const BreadcrumbsContainer = ({
  children,
  separator = '/',
}: IBreadcrumbsContainerProps) => (
  <nav className="min-h-6 pb-6 pt-6 pl-36">
    <ol className="flex items-center space-x-4 justify-start text-[14px] text-gray-600 font-medium">
      {Children.map(children, (child, index) => (
        <>
          {child}
          {index < Children.count(children) - 1
            ? <span>{separator}</span>
            : null}
        </>
      ))}
    </ol>
  </nav>
)

export const BreadCrumbs = ({
  children,
  withHome = false,
}: IBreadcrumbsProps) => {
  const paths = usePathname();
  const [trailingPath, setTrailingPath] = useState('');
  const context = useMemo(() => ({
    trailingPath,
    setTrailingPath,
  }), [trailingPath]);

  const pathNames = paths?.split('/').filter((path) => path) ?? [];
  const pathItems = pathNames
    .map((path, i) => ({
      name: path,
      path: pathNames.slice(0, i + 1).join('/'),
      translatedName: translatePathName(path),
    }));

  if (context.trailingPath && pathItems.length > 0 && context.trailingPath !== pathItems[pathItems.length - 1].name) {
    pathItems[pathItems.length - 1].name = context.trailingPath;
    pathItems[pathItems.length - 1].translatedName = translatePathName(context.trailingPath);
  }

  return (
    <>
      <BreadcrumbsContainer>
        {withHome && <BreadcrumbsItem href="/">Главная</BreadcrumbsItem>}
        {pathItems.map((item) => (
          <BreadcrumbsItem key={item.path} href={`/${item.path}`}>
            {item.name === 'loading'
              ? <Spinner className="w-4 h-4" />
              : item.translatedName}
          </BreadcrumbsItem>
        ))}
      </BreadcrumbsContainer>
      <BreadCrumbsContext.Provider value={context}>
        {children}
      </BreadCrumbsContext.Provider>
    </>
  );
};