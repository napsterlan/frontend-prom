'use client';

import { IUser } from '@/types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ru } from 'date-fns/locale/ru';

registerLocale('ru', ru);

interface IValidationErrors {
    Title?: string;
    Name?: string;
    UserID?: string;
    PublishDate?: string;
}

interface IProjectMainInfoProps {
    /**
     * Тип формы
     */
    type: 'project' | 'news';
    /**
     * Данные формы проекта
     */
    formData: {
        Title: string;
        Name: string;
        Slug: string;
        MetaTitle: string;
        MetaKeyword: string;
        MetaDescription: string;
        UserID?: number | null;
        PublishDate: string;
        Status: boolean;
    };
    /**
     * Объект с ошибками валидации
     */
    errors: IValidationErrors;
    /**
     * Список менеджеров для выбора
     */
    managers?: IUser[] | [];
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
export function FormMainInfo({
    type,
    formData,
    errors,
    managers,
    isAutoSlug,
    setFormData,
    setErrors,
    setIsAutoSlug,
    handleSlugChange
}: IProjectMainInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block mb-2">Title</label>
                <input
                    type="text"
                    className={`w-full p-2 border rounded ${errors.Title ? 'border-red-500' : ''}`}
                    value={formData.Title}
                    onChange={(e) => {
                        setFormData((prev: any) => ({ ...prev, Title: e.target.value }));
                        if (errors.Title) {
                            setErrors((prev: any) => ({ ...prev, title: undefined }));
                        }
                    }}
                />
                {errors.Title && (
                    <p className="text-red-500 text-sm mt-1">{errors.Title}</p>
                )}
            </div>

            <div>
                <label className="block mb-2">Name</label>
                <input
                    type="text"
                    className={`w-full p-2 border rounded ${errors.Name ? 'border-red-500' : ''}`}
                    value={formData.Name}
                    onChange={(e) => {
                        setFormData((prev: any) => ({ ...prev, Name: e.target.value }));
                        if (errors.Name) {
                            setErrors((prev: any) => ({ ...prev, name: undefined }));
                        }
                    }}
                />
                {errors.Name && (
                    <p className="text-red-500 text-sm mt-1">{errors.Name}</p>
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
                    value={formData.MetaTitle}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, MetaTitle: e.target.value }))}
                />
            </div>

            <div>
                <label className="block mb-2">metaKeyword</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.MetaKeyword}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, MetaKeyword: e.target.value }))}
                />
            </div>

            <div>
                <label className="block mb-2">metaDescription</label>
                <textarea
                    className="w-full p-2 border rounded"
                    value={formData.MetaDescription}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, MetaDescription: e.target.value }))}
                />
            </div>
            
            {type === 'project' &&  <div>
                <label className="block mb-2">Ответственный менеджер</label>
                <select
                    className={`w-full p-2 border rounded ${errors.UserID ? 'border-red-500' : ''}`}
                    value={formData.UserID || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, UserID: Number(e.target.value) }))}
                >
                    <option value="">Выберите менеджера</option>
                    {managers && managers.length > 0 && managers.map((manager) => (
                        <option key={manager.ID} value={manager.ID}>
                            {manager.LastName} {manager.FirstName}
                        </option>
                    ))}
                </select>
                {errors.UserID && (
                    <p className="text-red-500 text-sm mt-1">{errors.UserID}</p>
                )}
            </div>}

            <div>
                <div className="mb-2">
                    Дата публикации:
                    <DatePicker
                        selected={formData.PublishDate ? new Date(formData.PublishDate) : null}
                        onChange={(date) => {
                            setFormData((prev: any) => ({ ...prev, PublishDate: date }));
                            if (errors.PublishDate) {
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
                        className={`ml-2 border rounded p-2 w-[200px] ${errors.PublishDate ? 'border-red-500' : ''}`}
                        popperPlacement="bottom-start"
                        customInput={
                            <input
                                className={`border rounded p-2 w-full focus:outline-none focus:ring-2 ${
                                    errors.PublishDate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                            />
                        }
                    />
                    {errors.PublishDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.PublishDate}</p>
                    )}
                </div>
            </div>

            <div className="mb-2">
                <label className="block mb-2">Статус</label>
                <div 
                    onClick={(e) => setFormData((prev: any) => ({ ...prev, Status: !formData.Status }))}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    <div className={`w-8 h-4 rounded-full transition-colors ${formData.Status ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 rounded-full bg-white transform transition-transform mt-0.5 ${formData.Status ? 'translate-x-4' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-sm text-gray-500">{formData.Status ? 'Включено' : 'Отключено'}</span>
                </div>
            </div>
        </div>
    );
} 