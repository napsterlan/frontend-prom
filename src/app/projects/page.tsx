import {getAllProjectCategories, getAllProjects, searchFor} from '@/api/apiClient';
import {Project, ProjectCategory} from '@/types/types';
// import { Breadcrumbs } from '@/app/_components/Breadcrumbs';
import { ProjectsClient } from './projects-client';

interface SearchResult {
    id: number;
    name: string;
    href: string;
    date: string;
    image: string;
    score: number;
}

export const dynamic = 'force-dynamic';

async function getProjects(page: number = 1, category: string = "", search: string = "") {
    try {
        let response;
        let projects;
        if (search) {
            const searchResponse = await searchFor(search, "projects", page, category);
            projects = searchResponse.projects.map((result: SearchResult) => ({
                ID: result.id,
                Name: result.name,
                Slug: result.href,
                PublishDate: result.date,
                Images: result.image ? [{
                    ImageURL: result.image,
                    AltText: result.name
                }] : [],
            }));

            response = {
                data: projects,
                metadata: {
                    last_page: searchResponse.metadata?.last_page || 1,
                    total_records: searchResponse.metadata?.total_records || searchResponse.data.length,
                }
            };
        } else {
            response = await getAllProjects(page, category);
        }
        return response;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return {
            data: [],
            metadata: {
                last_page: 1,
                total_records: 0
            }
        };
    }
}

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams?: {
        page?: string;
        category?: string;
        search?: string;
    };
}) {
    const page = Number(searchParams?.page) || 1;
    const category = searchParams?.category || "";
    const search = searchParams?.search || "";

    const [projectsResponse, categoriesResponse] = await Promise.all([
        getProjects(page, category, search),
        getAllProjectCategories()
    ]);

    const { data: projects, metadata } = projectsResponse;
    const { data: categories } = categoriesResponse;

    return (
        <>
            {/* <Breadcrumbs /> */}
            <ProjectsClient
                initialProjects={projects}
                initialCategories={categories}
                currentPage={page}
                totalPages={metadata.last_page}
                totalRecords={metadata.total_records}
                searchQuery={search}
                currentCategory={category}
            />
        </>
    );
} 