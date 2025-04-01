"use client"

import { useBreadCrumbs } from './breadcrumbs/breadcrumbs-context';
import { useEffect } from 'react';

interface BreadcrumbsWrapperProps {
    pageName: string;
    children: React.ReactNode;
}

export default function BreadcrumbsWrapper({ pageName, children }: BreadcrumbsWrapperProps) {
    useBreadCrumbs(pageName);
    
    return <>{children}</>;
} 