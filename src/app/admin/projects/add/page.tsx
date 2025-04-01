import { useState, useCallback, useEffect } from 'react';
import { createProject, uploadImages, getAllProjectCategories, getProjectBySlug } from '@/api/apiClient';
import { useRouter } from 'next/router';
import { ProjectCategory } from '@/types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { transliterate } from '@/utils/transliterate';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { DropResult } from 'react-beautiful-dnd';
import NextImage from 'next/image';
import { LexicalEditor } from '@/app/_components/LexicalEditor/LexicalEditor';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { notFound } from 'next/navigation';
import { ProjectForm } from '../_components/project-form';

interface Props {
    params: {   
        slug: string;
    };
}

export default async function AddProjectPage({ params }: Props) {
    const { slug } = params;
    
    try {
        const categories = await getAllProjectCategories();
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
            PublishDate: null,
        }
        return (
            <BreadcrumbsWrapper pageName="Добавление проекта">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Добавление проекта</h1>
                <ProjectForm 
                    project={project}
                    isEditing={false}
                    categories={categories.data}
                />
            </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        notFound();
    }
} 