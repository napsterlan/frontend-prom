'use client';

import { IProject, IProjectCategory } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Pagination } from "@/app/_components/Pagination";
import { HtmlContent } from "@/app/_components/HtmlComponent/HtmlContent";

interface IProjectsClientProps {
    initialProjects: IProject[];
    initialCategories: IProjectCategory[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    searchQuery: string;
    currentCategory: string;
}

function ProjectSkeleton() {
    return (
        <div className="w-full max-w-[350px] bg-white border rounded-xl border-gray-200 shadow-sm animate-pulse">
            <div className="w-full h-[200px] bg-gray-200 rounded-t-xl" />
            <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
            </div>
        </div>
    );
}

export function ProjectsClient({
    initialProjects,
    initialCategories,
    currentPage,
    totalPages,
    totalRecords,
    searchQuery,
    currentCategory
}: IProjectsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsObj = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchQuery || "");

    // Reset loading state when search params or pathname changes
    useEffect(() => {
        setIsLoading(false);
    }, [searchParamsObj, pathname]);

    const currentCategoryData = initialCategories?.find(x => x.Slug === currentCategory) || null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        searchParams.set('page', '1');
        if (currentCategory) searchParams.set('category', currentCategory);
        if (searchTerm) searchParams.set('search', searchTerm);
        
        setIsLoading(true);
        router.push(`/projects?${searchParams.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const searchParams = new URLSearchParams(searchParamsObj?.toString() || '');
        searchParams.set('page', page.toString());
        
        setIsLoading(true);
        router.push(`/projects?${searchParams.toString()}`, { scroll: true });
    };

    const clearCategory = () => {
        setIsLoading(true);
        router.push('/projects?page=1');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex gap-6">
                {/* Categories Sidebar */}
                <div className="hidden md:block w-64 flex-shrink-0 pt-5">
                    <h2 className="text-xl font-bold mb-4 text-[20px]">Категории</h2>
                    {currentCategory && (
                        <button
                            onClick={clearCategory}
                            className="all-projects-link"
                        >
                            ← Все проекты
                        </button>
                    )}
                    <ul className="categories-menu">
                        {Array.isArray(initialCategories) && initialCategories.map((category) => (
                            <li key={category.ID || 'fallback-key'}>
                                <Link
                                    href={{
                                        pathname: '/projects',
                                        query: { category: category?.Slug },
                                    }}
                                    className={`category-link ${
                                        currentCategory === category?.Slug ? 'active' : ''
                                    } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    {category?.Name || 'Unnamed Category'}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-center items-center mb-6 flex-col leading-[1]">
                        <h1 className="text-[32px] font-bold">Проекты</h1>
                        <div className="mt-2.5 text-[22px]">
                            {currentCategoryData?.Name || ""}
                        </div>
                    </div>
                    <div className="flex text-[18px] mb-4 px-[5%] justify-between items-center">
                        <div className="flex-1 flex items-center min-w-[360px]">
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-[37px] leading-[27px] pl-5 shadow-none rounded-l-[20px] bg-[#e9e9e9] text-[#333] text-base font-commissioner font-extralight border-none outline-none focus:outline-none placeholder:text-[rgba(255,255,255,0.70)] placeholder:text-[15px] placeholder:font-manrope placeholder:font-small"
                                    placeholder="Поиск проектов..."
                                />
                                <button
                                    type="submit"
                                    className="flex items-center h-[37px] text-[13px] leading-[40px] pr-3 align-top text-[#d5d5d5] rounded-r-[20px] bg-[#e9e9e9]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M16.8271 18C16.5077 17.9051 16.2865 17.6877 16.0613 17.4623C14.7056 16.0983 13.3459 14.7343 11.9902 13.3743C11.9452 13.3268 11.9042 13.2754 11.8592 13.224C9.82776 14.5169 7.65709 14.8806 5.33898 14.2124C3.62292 13.7182 2.25908 12.7219 1.26795 11.2828C-0.874054 8.17127 -0.247427 4.08322 2.73417 1.68732C5.57243 -0.589975 9.58202 -0.542531 12.3547 1.71104C13.9316 2.99202 14.8408 4.64068 15.021 6.63331C15.2012 8.62199 14.5991 10.3853 13.2926 11.943C13.3786 12.03 13.4606 12.117 13.5466 12.2C14.9186 13.5759 16.2865 14.9517 17.6586 16.3237C18.0845 16.7507 18.1214 17.32 17.7159 17.6995C17.5766 17.83 17.3678 17.8972 17.1917 17.996C17.0688 18 16.95 18 16.8271 18ZM7.53012 1.90872C4.4748 1.90477 1.98058 4.31253 1.97239 7.26984C1.9642 10.2232 4.48709 12.6586 7.53832 12.6389C10.6141 12.6191 13.092 10.2272 13.0879 7.2738C13.0838 4.31648 10.5895 1.90872 7.53012 1.90872Z" fill="#a1a1a1" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                        <div>
                            Опубликовано проектов: <span className="text-PLGreen font-bold ">{totalRecords}</span>
                        </div>
                    </div>

                    <div className='flex flex-col items-center'>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center w-full">
                                {[...Array(6)].map((_, index) => (
                                    <ProjectSkeleton key={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                                {Array.isArray(initialProjects) && initialProjects.map(project => (
                                    <Link href={`/projects/${project.Slug}`}
                                        key={project.ID}
                                        className="w-full max-w-[350px] bg-white border rounded-xl border-gray-200 shadow-sm flex flex-col h-full">
                                        {project.Images?.[0] && (
                                            <Image
                                                src={project.Images[0].ImageURL?project.Images[0].ImageURL:'./placeholder.png'}
                                                alt={project.Images[0].AltText}
                                                width={350}
                                                height={200}
                                                className="w-full h-[200px] object-cover rounded-t-xl"
                                            />
                                        )}
                                        <div className="flex flex-col justify-between h-ful3">
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold mb-2">{project.Name}</h3>
                                            </div>
                                        <div className="p-4 text-[14px] font-medium">
                                            {project.PublishDate && (
                                                <div className="text-gray-600 text-sm line-clamp-3">
                                                    {formatDate(project.PublishDate)}
                                                </div>
                                            )}
                                        </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {!isLoading && totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}

                    {currentCategoryData?.Description && (
                        <div className="mt-8">
                            <HtmlContent
                                html={currentCategoryData.Description}
                                className="leading-[1]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 