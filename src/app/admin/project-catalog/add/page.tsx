import { getAllProjectCategories } from '@/api';
import 'react-datepicker/dist/react-datepicker.css';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { ProjectCategoryForm } from '../_components/ProjectCategoryForm';

export default async function AddProjectCategories() {
    
    try {
        const projectCategories = await getAllProjectCategories();
        return (
            <BreadcrumbsWrapper pageName="Добавление проекта">
                <ProjectCategoryForm
                    projectCategories={projectCategories.data}
                    isEditing={false}
                />
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        return {
            notFound: true,
        };
    }
} 