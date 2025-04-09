import { getProjectBySlug } from "@/api";
import { Project } from "@/types/types";
// import { Breadcrumbs } from '@/app/_components/Breadcrumbs';
import { ProjectDetailClient } from './project-detail-client';
import { notFound } from 'next/navigation';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
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

export default async function ProjectDetailPage({
    params
}: {
    params: { slug: string }
}) {
    const projectData = await getProject(params.slug);

    if (!projectData) {
        notFound();
    }

    return (
        <BreadcrumbsWrapper pageName={projectData.Name}>
            <ProjectDetailClient projectData={projectData} />
        </BreadcrumbsWrapper>
    );
} 