'use client';

import { INews, INewsFormData } from '@/types/news';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { createNews, updateNews } from '@/api';

interface NewsFormProps {
    news: INews;
    isEditing: boolean;
    projectCategories: any[];
    productCategories: any[];
}

export function NewsForm({ news, isEditing, projectCategories, productCategories }: NewsFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [formData, setFormData] = useState<INewsFormData>({
        title: news.Title,   
        description: news.Description,
        metaTitle: news.MetaTitle,
        metaDescription: news.MetaDescription,
        metaKeyword: news.MetaKeyword,
        slug: news.Slug,
        existingImages: news.Images || [],
        newImages: [],
        deletedImageIds: [],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
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