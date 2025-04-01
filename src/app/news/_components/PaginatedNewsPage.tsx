'use client';

import { useRouter } from 'next/navigation';
import { Pagination } from "@/app/_components/Pagination";

interface PaginatedNewsPageProps {
    currentPage: number;
    totalPages: number;
}

export function PaginatedNewsPage({ currentPage, totalPages }: PaginatedNewsPageProps) {
    const router = useRouter();

    const handlePageChange = (page: number) => {
        router.push(`/news?page=${page}`);
    };

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
}