import { getAllProjectCategories, getCategories } from '@/api';
import 'react-datepicker/dist/react-datepicker.css';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { notFound } from 'next/navigation';
import { NewsForm } from '../_components/news-form';

export default async function AddNewsPage() {
    
    try {
        const projectCategories = await getAllProjectCategories();
        const news= {
            ID: 0,
            Title: '',
            Name: '',
            Description: '',
            Images: [],
            MetaTitle: '',
            MetaDescription: '',
            MetaKeyword: '',
            FullPath: '',
            Slug: '',
            CreatedAt: '',
            UpdatedAt: '',
            DeletedAt: null,
            PublishDate: null,
        }
        const productCategories = await getCategories();

        return (
            <BreadcrumbsWrapper pageName="Добавление новости">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Добавление новости</h1>
                <NewsForm 
                    news={news}
                    projectCategories={projectCategories.data}
                    productCategories={productCategories.data}
                    isEditing={false}
                />
            </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        notFound();
    }
} 