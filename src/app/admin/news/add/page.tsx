import { getAllProjectCategories, getCategories } from '@/api';
import 'react-datepicker/dist/react-datepicker.css';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
// import { notFound } from 'next/navigation';
import { NewsForm } from '../_components/NewsForm';

export default async function AddNewsPage() {
    
    try {
        const newsCategories = await getAllProjectCategories();
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
            DeletedAt: '',
            PublishDate: '',
            Status: false,
        }
        const productCategories = await getCategories();

        return (
            <BreadcrumbsWrapper pageName="Добавление новости">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Добавление новости</h1>
                <NewsForm 
                    news={news}
                    newsCategories={newsCategories.data}
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