"use client"

import { useBreadCrumbs } from './breadcrumbs/breadcrumbs-context';

interface BreadcrumbsWrapperProps {
    pageName: string;
    children: React.ReactNode;
}

export default function BreadcrumbsWrapper({ pageName, children }: BreadcrumbsWrapperProps) {
    useBreadCrumbs(pageName);
    
    return <>{children}</>;
} 