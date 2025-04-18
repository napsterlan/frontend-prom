'use client';

import {  IImages, INews, IUser } from '@/types';
import { createUser, updateUserById, uploadImages } from '@/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { Preloader } from '@/components/ui/Preloader';
import { FormImageGallery } from '../../_components/form/FormImageGallery';
import { FormCompany } from '../../_components/form/FormCompany';
import { ICompany } from '@/types/userTypes';

interface IValidationErrors {
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Password?: string;
    Phone?: string;
    PartnerLevel?: string;
    Role?: string;
    Status?: string;
    Company?: string;
}

function validateProject(formData: typeof UserForm.prototype.formData): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!formData.FirstName) {
        errors.FirstName = 'Имя обязательно';
    } else if (formData.FirstName.length > 255) {
        errors.FirstName = 'Имя должно быть меньше 255 символов';
    }

    if (!formData.LastName) {
        errors.LastName = 'Фамилия обязательна';
    } else if (formData.LastName.length > 255) {
        errors.LastName = 'Фамилия должна быть меньше 255 символов';
    }

    if (!formData.Email) {
        errors.Email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
        errors.Email = 'Некорректный email';
    }

    const cleanPhone = formData.Phone.replace(/\D/g, ''); // Удаляем всё, кроме цифр
    if (cleanPhone.startsWith('375') && cleanPhone.length === 13) {
        // Беларусь: +375 (12 цифр)
    } else if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
        // Россия: +7 (11 цифр)
    } else {
        errors.Phone = 'Некорректный телефон (формат: +375 XX XXX XX XX или +7 XXX XXX XX XX)';
    }

    return errors;
}

interface IProjectFormProps {
    user: IUser;
    isEditing: boolean;
    maxImages?: number;
}

interface IExistingImages {
    ID?: number | null;
    ImageURL: string;
    AltText: string;
    Order: number;
    file?: File;
    ShortURL?: string;
    IsNew?: boolean;
}

interface IUserChanges extends Omit<IUser, 'Company'> {
    Company: number[];
}

interface IUserFormData extends Omit<IUser, 'Images'> {
    AvatarImages: IExistingImages[];
    QRCodeImages: IExistingImages[];
}

function generatePassword (length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    return password;
};

export function UserForm({ user, isEditing, maxImages = 1 }: IProjectFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [errors, setErrors] = useState<IValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<IUserFormData>({
        ID: user.ID,
        FirstName: user.FirstName || '',
        LastName: user.LastName || '',
        Email: user.Email || '',
        Role: user.Role || 'admin',
        PartnerLevel: user.PartnerLevel ||0,
        Phone: user.Phone || '',
        Activated: user.Activated,
        Password: generatePassword(),
        AvatarImages: [{
            Order: 0,
            ID: 1,
            ImageURL: user.ImageURL || '',
            AltText: '',
            ShortURL: '',
        }],
        QRCodeImages: [{
            Order: 0,
            ID: 2,
            ImageURL: user.QRCodeURL || '',
            AltText: '',
            ShortURL: '',
        }],
        Status: user.Status,
        ImageURL: user.ImageURL || '',
        QRCodeURL: user.QRCodeURL || '',
        Company: user.Company?.map((company: ICompany) => ({
            ...company,
            FullName: `
                ${company.Name || ''} 
                ${company.INN ? " / ИНН:" + company.INN : ''} 
                ${company.KPP ? " / КПП:" + company.KPP : ''} 
                ${company.LegalAddress ? " / Юр.адрес: " + company.LegalAddress : ''}
                ${company?.Addresses?.length ? " / Физ.адрес: " + company.Addresses[0].Address : ''}
            `
        })) || [],
    });

    const handleUploadImages = async (image: IExistingImages) => {
        if (!image?.IsNew && image?.ImageURL) {
            return image.ImageURL
        } else if (!image?.IsNew && !image?.ImageURL) {
            return ''
        } else if (image?.IsNew && image?.file) {
            const paths = await uploadImages([image.file], `users/${user.ID}`);
            return paths.filePaths[0]
        } 
    };
    console.log('formData', formData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateProject(formData);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const NewURLsAvatarImages = await handleUploadImages(formData.AvatarImages[0]);
        const NewURLsQRCodeImages = await handleUploadImages(formData.QRCodeImages[0]);

        setLoading(true);

        const getChangedFields = (originalUser: IUser, currentFormData: IUserFormData) => {
            const changes: Partial<IUserChanges> = {};
            if (originalUser.FirstName !== currentFormData.FirstName) changes.FirstName = currentFormData.FirstName || '';
            if (originalUser.LastName !== currentFormData.LastName) changes.LastName = currentFormData.LastName || '';
            if (originalUser.Email !== currentFormData.Email) changes.Email = currentFormData.Email || '';
            if (originalUser.Role !== currentFormData.Role) changes.Role = currentFormData.Role || '';
            if (originalUser.PartnerLevel !== currentFormData.PartnerLevel) changes.PartnerLevel = Number(currentFormData.PartnerLevel) || 0;
            if (originalUser.Phone !== currentFormData.Phone) changes.Phone = currentFormData.Phone || '';
            if (originalUser.Status !== currentFormData.Status) changes.Status = currentFormData.Status;
            
            // Проверяем изменения в изображениях
            if (formData.Role === 'manager' && (formData.AvatarImages[0]?.IsNew || originalUser.ImageURL !== currentFormData.ImageURL)) {
                changes.ImageURL = NewURLsAvatarImages || '';
            }
            if (formData.Role === 'manager' && (formData.QRCodeImages[0]?.IsNew || originalUser.QRCodeURL !== currentFormData.QRCodeURL)) {
                changes.QRCodeURL = NewURLsQRCodeImages || '';
            }
        
            // Проверяем изменения в компаниях
            const originalCompanyIds = originalUser.Company?.map((c: ICompany) => c.ID).sort() || [];
            const currentCompanyIds = currentFormData.Company?.map((c: ICompany) => c.ID).sort() || [];
            
            if (JSON.stringify(originalCompanyIds) !== JSON.stringify(currentCompanyIds)) {
                changes.Company = currentFormData.Company?.map((company: ICompany) => company.ID) || [];
            }
        
            return changes;
        };

        try {
            // В handleSubmit заменяем вызов updateUserById на:
            if (isEditing && formData.ID) {
                const changedFields = getChangedFields(user, formData);
                
                if (Object.keys(changedFields).length > 0) {
                    await updateUserById(formData.ID, changedFields)
                        .then(() => {
                            router.push(`/admin/users/${formData.ID}`);
                        });
                } else {
                    showToast('Нет изменений для сохранения', 'info');
                    setLoading(false);
                    return;
                }
            } else {
                await createUser({
                    ...formData,
                    Company: formData.Company[0]
                })
                .then((res) => {
                    router.push(`/admin/users/${res.data.ID}`);
                });
            }

            showToast('Пользователь успешно сохранен', 'success');
            setLoading(false);      
        } catch (error) {
            showToast('Ошибка при сохранении пользователя', 'error');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {loading && <Preloader fullScreen />}
            
            {/* Верхняя панель с кнопкой сохранения */}
            <div className="flex justify-end items-center mb-6 sticky top-0 bg-white z-10 py-4 border-b">
                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                    Сохранить пользователя
                </button>
            </div>

            <div>
                {/* Верхний блок с двумя колонками */}
                <div className="flex gap-6 mb-6">
                    {/* Левая колонка */}
                    <div className='w-1/2 flex-col gap-6 mb-6'>
                        {/* изображения */}
                        {formData.Role === 'manager' && <div className="flex flex gap-10"> 
                            <div className='mb-6'>
                                <label className="block mb-2 font-bold">Аватарка</label>
                                <FormImageGallery
                                    existingImages={formData.AvatarImages}
                                    onImagesChange={(images) => setFormData(prev => ({ ...prev, AvatarImages: images }))}
                                    onDeleteImages={(deletedIds) => setFormData(prev => ({ ...prev, DeletedImages: deletedIds }))}
                                    maxImages={maxImages}
                                    inputId="avatar-upload"
                                    imagesRow={1}
                                />
                            </div>
                            <div> 
                                <label className="block mb-2 font-bold">QR-код</label>
                                <FormImageGallery
                                    existingImages={formData.QRCodeImages}
                                    onImagesChange={(images) => setFormData(prev => ({ ...prev, QRCodeImages: images }))}
                                    onDeleteImages={(deletedIds) => setFormData(prev => ({ ...prev, DeletedImages: deletedIds }))}
                                    maxImages={maxImages}
                                    inputId="qr-upload"
                                    imagesRow={1}
                                />
                            </div>
                        </div>}
                    </div>

                    {/* Правая колонка - основная информация */}
                    <div className="w-1/2">

                        <div className="mb-2">
                            <label className="block mb-2">Имя</label>
                            <input
                                type="text"
                                className={`w-full p-2 border rounded ${errors.FirstName ? 'border-red-500' : ''}`}
                                value={formData.FirstName}
                                onChange={(e) => {
                                    setFormData((prev: any) => ({ ...prev, FirstName: e.target.value }));
                                    if (errors.FirstName) {
                                        setErrors((prev: any) => ({ ...prev, firstName: undefined }));
                                    }
                                }}
                            />
                            {errors.FirstName && (
                                <p className="text-red-500 text-sm mt-1">{errors.FirstName}</p>
                            )}
                        </div>

                        <div className="mb-2">
                                <label className="block mb-2">Фамилия</label>
                                <input
                                type="text"
                                className={`w-full p-2 border rounded ${errors.LastName ? 'border-red-500' : ''}`}
                                value={formData.LastName}
                                onChange={(e) => {
                                    setFormData((prev: any) => ({ ...prev, LastName: e.target.value }));
                                    if (errors.LastName) {
                                        setErrors((prev: any) => ({ ...prev, lastName: undefined }));
                                    }
                                }}
                            />
                                {errors.LastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.LastName}</p>
                                )}
                        </div>

                        <div className="mb-2">
                            <div>
                                <label className="block mb-2">Email</label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${errors.Email ? 'border-red-500' : ''}`}
                                    value={formData.Email}
                                onChange={(e) => {
                                    setFormData((prev: any) => ({ ...prev, Email: e.target.value }));
                                    if (errors.Email) {
                                        setErrors((prev: any) => ({ ...prev, email: undefined }));
                                    }
                                }}
                            />
                            {errors.Email && (
                                <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
                            )}
                            </div>
                        </div>

                        {!isEditing && <div className="mb-2">
                            <label className="block mb-2">Пароль</label>
                            <input
                                type="text"
                                className={`w-full p-2 border rounded ${errors.Password ? 'border-red-500' : ''}`}
                                value={formData.Password}
                                onChange={(e) => {
                                    setFormData((prev: any) => ({ ...prev, Password: e.target.value }));
                                    if (errors.Password) {
                                        setErrors((prev: any) => ({ ...prev, Password: undefined }));
                                    }
                                }}
                            />
                            {errors.Password && (
                                <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
                            )}
                        </div>}

                        <div className="mb-2">
                            <label className="block mb-2">Телефон</label>
                            <input
                                type="text"
                                value={formData.Phone}
                                onChange={(e) => {
                                    setFormData((prev: any) => ({ ...prev, Phone: e.target.value }));
                                    if (errors.Phone) {
                                        setErrors((prev: any) => ({ ...prev, Phone: undefined }));
                                    }
                                }}
                                className={`w-full p-2 border rounded ${errors.Phone ? 'border-red-500' : ''}`}
                            />
                            {errors.Phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
                            )}
                        </div>

                        <div className="mb-2">
                            <label className="block mb-2">Уровень партнерства</label>
                            <select
                                className={`w-full p-2 border rounded ${errors.PartnerLevel ? 'border-red-500' : ''}`}
                                value={formData.PartnerLevel}
                                onChange={(e) => {
                                    setFormData((prev: any) => ({ ...prev, PartnerLevel: e.target.value }));
                                    if (errors.PartnerLevel) {
                                        setErrors((prev: any) => ({ ...prev, PartnerLevel: undefined }));
                                    }
                                }}
                            >
                                <option value={0}>Не выбрано</option>
                                <option value={1}>PartnerLevelOne</option>
                                <option value={2}>PartnerLevelTwo</option>
                                <option value={3}>PartnerLevelThree</option>
                                <option value={4}>PartnerLevelFour</option>
                                <option value={5}>PartnerLevelFive</option>

                            </select>
                        </div>

                        <div className="mb-2">
                            <label className="block mb-2">Роль</label>
                            <select
                                className={`w-full p-2 border rounded ${errors.Role ? 'border-red-500' : ''}`}
                                value={formData.Role}
                                onChange={(e) => {
                                    setFormData((prev: any) => ({ ...prev, Role: e.target.value }));
                                    if (errors.Role) {
                                        setErrors((prev: any) => ({ ...prev, Role: undefined }));
                                    }
                                }}
                            >
                                <option value={'admin'}>admin</option>
                                <option value={'client'}>client</option>
                                <option value={'manager'}>manager</option>
                                <option value={'content_manager'}>content_manager</option>
                            </select>
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
                </div>
            </div>

            <FormCompany
                companies={formData.Company}
                setCompanies={(companies) => setFormData(prev => ({ ...prev, Company: companies }))}
                label="Компания"
            />
        </form>
    );
}