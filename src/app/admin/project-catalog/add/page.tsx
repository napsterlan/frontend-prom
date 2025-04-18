import { getAllProjectCategories } from '@/api';
import 'react-datepicker/dist/react-datepicker.css';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { ProjectCategoryForm } from '../_components/ProjectCategoryForm';

export default async function AddProjectCategories() {
    
    try {
        const projectCategories = await getAllProjectCategories();
        return (
            <BreadcrumbsWrapper pageName="Добавление проекта">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Добавление проекта</h1>
                <ProjectCategoryForm
                    projectCategories={projectCategories.data}
                    isEditing={false}
                />
            </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        return {
            notFound: true,
        };
    }
} 