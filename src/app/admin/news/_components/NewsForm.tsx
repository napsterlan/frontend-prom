'use client';

import { INews, IProjectCategory, ICategory, IImages } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { createNews, updateNews } from '@/api';

interface INewsFormProps {
    news: INews;
    isEditing: boolean;
    projectCategories: IProjectCategory[]; 
    productCategories: ICategory[];
}

interface INewsData extends INews {
    ExistingImages: IImages[] | [];
    NewImages: File[] | [];
    DeletedImageIds: number[] | [];
} 

export function NewsForm({ news, isEditing, projectCategories, productCategories }: INewsFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [formData, setFormData] = useState<INewsData>({
        ID: news.ID || null,
        Title: news.Title,   
        Description: news.Description,
        MetaTitle: news.MetaTitle,
        MetaDescription: news.MetaDescription,
        MetaKeyword: news.MetaKeyword,
        Slug: news.Slug,
        ExistingImages: news.Images || [],
        NewImages: [],
        DeletedImageIds: [],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                if (!news.ID) throw new Error('ID новости не найден');
                await updateNews(news.ID, formData);
                showToast('Новость успешно обновлена', 'success');
            } else {
                await createNews(formData);
                showToast('Новость успешно создана', 'success');
            }
            router.push('/admin/news');
            router.refresh();
        } catch (error) {
            console.error('Error saving news:', error);
            showToast('Ошибка при сохранении новости', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                павыдподлаывп
            </div>
        </form>
    );
} 