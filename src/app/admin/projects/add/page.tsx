import { getAllProjectCategories, getCategories } from '@/api';
import 'react-datepicker/dist/react-datepicker.css';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
// import { notFound } from 'next/navigation';
import { ProjectForm } from '../_components/project-form';

export default async function AddProjectPage() {
    
    try {
        const projectCategories = await getAllProjectCategories();
        const project = {
            ID: 0,
            Title: '',
            Name: '',
            Description: '',
            MetaTitle: '',
            MetaDescription: '',
            MetaKeyword: '',
            ProjectsCategories: [],
            RelatedProducts: [],
            Images: [],
            PublishDate: '',
            MainCategoryID: null,
            User: null,
            Slug: '',
            Status: false,
            RelatedNews: [],
            ProjectImages: [],
            fullPath: '',
            FullPath: '',
            CreatedAt: '',
            UpdatedAt: '',
            DeletedAt: ''
        }
        const productCategories = await getCategories();

        return (
            <BreadcrumbsWrapper pageName="Добавление проекта">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Добавление проекта</h1>
                <ProjectForm 
                    project={project}
                    projectCategories={projectCategories.data}
                    productCategories={productCategories.data}
                    isEditing={false}
                />
            </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        // notFound();
        console.log('not found 404'); 
        return;
    }
} 