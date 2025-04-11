import { getProjectBySlug } from "@/api";
// import { Breadcrumbs } from '@/app/_components/Breadcrumbs';
import { ProjectDetailClient } from './project-detail-client';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';
export const dynamic = 'force-dynamic';

async function getProject(slug: string) {
    try {
        const response = await getProjectBySlug(slug);
        if (!response || !response.data) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

export default async function ProjectDetailPage({ params, searchParams }: NextPageProps) {
    const { slug } = await params;

    if (!slug) {
        return {
            notFound: true,
        };
    }
    
    const projectData = await getProject(slug);

    if (!projectData) {
        return {
            notFound: true,
        };
    }

    return (
        <BreadcrumbsWrapper pageName={projectData.Name}>
            <ProjectDetailClient projectData={projectData} />
        </BreadcrumbsWrapper>
    );
} 