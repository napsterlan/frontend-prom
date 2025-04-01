'use client';

import { Project } from '@/types/types';
import { deleteProjectById } from '@/api/apiClient';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProjectsTableProps {
    initialProjects: Project[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export function ProjectsTable({ initialProjects, currentPage, totalPages, totalRecords }: ProjectsTableProps) {
    const router = useRouter();

    const handleDelete = async (projectId: number) => {
        if (confirm('Вы уверены, что хотите удалить этот проект?')) {
            try {
                await deleteProjectById(projectId);
                router.refresh(); // Refresh the page after deletion
            } catch (error) {
                console.error('Ошибка при удалении проекта:', error);
            }
        }
    };

    const handlePageChange = (page: number) => {
        router.push(`/admin/projects?page=${page}`);
        router.refresh();
    };

    const getProjectImageUrl = (project: Project): string => {
        if (project.Images && project.Images.length > 0 && project.Images[0].ImageURL) {
            return project.Images[0].ImageURL;
        }
        return '/placeholder.png';
    };

    const getProjectImageAlt = (project: Project): string => {
        if (project.Images && project.Images.length > 0 && project.Images[0].AltText) {
            return project.Images[0].AltText;
        }
        return 'Заглушка';
    };

    const renderPaginationControls = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded ${
                        currentPage === i
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                    Всего записей: {totalRecords}
                </div>
                <div className="flex items-center">
                    {currentPage > 1 && (
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            ←
                        </button>
                    )}
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => handlePageChange(1)}
                                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="mx-2">...</span>}
                        </>
                    )}
                    {pages}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="mx-2">...</span>}
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    {currentPage < totalPages && (
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            →
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Фото</th>
                        <th className="py-3 px-6 text-left">Название</th>
                        <th className="py-3 px-6 text-right">Действия</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {initialProjects.map(project => (
                        <tr key={project.ID} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6">
                                <Image 
                                    src={getProjectImageUrl(project)}
                                    alt={getProjectImageAlt(project)}
                                    className="object-cover" 
                                    width={64}
                                    height={64}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder.png';
                                    }}
                                />
                            </td>
                            <td className="py-3 px-6">{project.Name}</td>
                            <td className="py-3 px-6 text-right">
                                <Link
                                    href={`/admin/projects/${project.Slug}`}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                >
                                    Редактировать
                                </Link>
                                <button 
                                    onClick={() => handleDelete(project.ID)} 
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {renderPaginationControls()}
        </div>
    );
} 