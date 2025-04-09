'use client';

import { IUser } from '@/types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ru } from 'date-fns/locale/ru';

interface ValidationErrors {
    title?: string;
    name?: string;
    userID?: string;
    publishDate?: string;
}

interface ProjectMainInfoProps {
    /**
     * Данные формы проекта
     */
    formData: {
        Title: string;
        Name: string;
        Slug: string;
        metaTitle: string;
        metaKeyword: string;
        metaDescription: string;
        UserID: number | null;
        PublishDate: Date | null;
        Status: boolean;
    };
    /**
     * Объект с ошибками валидации
     */
    errors: ValidationErrors;
    /**
     * Список менеджеров для выбора
     */
    managers: IUser[];
    /**
     * Флаг автоматической генерации SEO URL
     */
    isAutoSlug: boolean;
    /**
     * Callback для обновления данных формы
     */
    setFormData: (data: any) => void;
    /**
     * Callback для обновления ошибок
     */
    setErrors: (errors: any) => void;
    /**
     * Callback для переключения автогенерации SEO URL
     */
    setIsAutoSlug: (value: boolean) => void;
    /**
     * Callback для обработки изменения SEO URL
     */
    handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Компонент основной информации проекта
 * 
 * @component
 * @example
 * ```tsx
 * <ProjectMainInfo
 *   formData={formData}
 *   errors={errors}
 *   managers={managers}
 *   isAutoSlug={isAutoSlug}
 *   setFormData={setFormData}
 *   setErrors={setErrors}
 *   setIsAutoSlug={setIsAutoSlug}
 *   handleSlugChange={handleSlugChange}
 * />
 * ```
 */
export function ProjectMainInfo({
    formData,
    errors,
    managers,
    isAutoSlug,
    setFormData,
    setErrors,
    setIsAutoSlug,
    handleSlugChange
}: ProjectMainInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block mb-2">Title</label>
                <input
                    type="text"
                    className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
                    value={formData.Title}
                    onChange={(e) => {
                        setFormData((prev: any) => ({ ...prev, Title: e.target.value }));
                        if (errors.title) {
                            setErrors((prev: any) => ({ ...prev, title: undefined }));
                        }
                    }}
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
            </div>

            <div>
                <label className="block mb-2">Name</label>
                <input
                    type="text"
                    className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                    value={formData.Name}
                    onChange={(e) => {
                        setFormData((prev: any) => ({ ...prev, Name: e.target.value }));
                        if (errors.name) {
                            setErrors((prev: any) => ({ ...prev, name: undefined }));
                        }
                    }}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label>SEO URL</label>
                    <div 
                        onClick={() => setIsAutoSlug(!isAutoSlug)}
                        className="flex items-center gap-2 cursor-pointer select-none"
                    >
                        <span className="text-sm text-gray-500">Авто</span>
                        <div className={`w-8 h-4 rounded-full transition-colors ${isAutoSlug ? 'bg-blue-500' : 'bg-gray-300'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transform transition-transform mt-0.5 ${isAutoSlug ? 'translate-x-4' : 'translate-x-1'}`} />
                        </div>
                    </div>
                </div>
                <input
                    type="text"
                    className="w-full p-2 border rounded font-mono"
                    value={formData.Slug}
                    onChange={handleSlugChange}
                    disabled={isAutoSlug}
                    placeholder="seo-url"
                />
            </div>

            <div>
                <label className="block mb-2">metaTitle</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, metaTitle: e.target.value }))}
                />
            </div>

            <div>
                <label className="block mb-2">metaKeyword</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.metaKeyword}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, metaKeyword: e.target.value }))}
                />
            </div>

            <div>
                <label className="block mb-2">metaDescription</label>
                <textarea
                    className="w-full p-2 border rounded"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, metaDescription: e.target.value }))}
                />
            </div>
            
            <div>
                <label className="block mb-2">Ответственный менеджер</label>
                <select
                    className={`w-full p-2 border rounded ${errors.userID ? 'border-red-500' : ''}`}
                    value={formData.UserID || ''}
                    onChange={(e) => {
                        const selectedManager = managers.find(m => m.ID === Number(e.target.value));
                        setFormData((prev: any) => ({ ...prev, UserID: selectedManager?.ID || null }));
                        if (errors.userID) {
                            setErrors((prev: any) => ({ ...prev, userID: undefined }));
                        }
                    }}
                >
                    <option value="">Выберите менеджера</option>
                    {managers.map((manager) => (
                        <option key={manager.ID} value={manager.ID}>
                            {manager.LastName} {manager.FirstName}
                        </option>
                    ))}
                </select>
                {errors.userID && (
                    <p className="text-red-500 text-sm mt-1">{errors.userID}</p>
                )}
            </div>

            <div>
                <div className="mb-2">
                    Дата публикации:
                    <DatePicker
                        selected={formData.PublishDate}
                        onChange={(date) => {
                            setFormData((prev: any) => ({ ...prev, PublishDate: date }));
                            if (errors.publishDate) {
                                setErrors((prev: any) => ({ ...prev, publishDate: undefined }));
                            }
                        }}
                        showTimeSelect
                        dateFormat="dd.MM.yyyy HH:mm"
                        timeFormat="HH:mm"
                        timeCaption="Время"
                        locale="ru"
                        placeholderText="Выберите дату и время"
                        timeIntervals={15}
                        className={`ml-2 border rounded p-2 w-[200px] ${errors.publishDate ? 'border-red-500' : ''}`}
                        popperPlacement="bottom-start"
                        customInput={
                            <input
                                className={`border rounded p-2 w-full focus:outline-none focus:ring-2 ${
                                    errors.publishDate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                            />
                        }
                    />
                    {errors.publishDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.publishDate}</p>
                    )}
                </div>
            </div>

            <div className="mb-2">
                <label className="block mb-2">Статус</label>
                <select
                    className="w-full p-2 border rounded"
                    value={formData.Status.toString()}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, Status: e.target.value === 'true' }))}
                >
                    <option value="true">Включено</option>
                    <option value="false">Отключено</option>
                </select>
            </div>
        </div>
    );
} 