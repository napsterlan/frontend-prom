import {  getCategories } from '@/api';
import 'react-datepicker/dist/react-datepicker.css';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NewsForm } from '../_components/NewsForm';

export default async function AddNewsPage() {
    
    try {
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
            RelatedProductCategories: [], // В каких категориях показывать новость
            NewsInProductCategoriesToShow: [], //Какие категории показывать в новости
            CreatedAt: '',
            UpdatedAt: '',
            DeletedAt: '',
            PublishDate: '',
            Status: false,
        }

        return (
            <BreadcrumbsWrapper pageName="Добавление новости">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Добавление новости</h1>
                <NewsForm 
                    news={news}
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