'use client';

import { IDadataCompany } from '@/types';
import { ICompany, IAddress } from '@/types/userTypes';
import { createCompany, updateCompanyById, getDadataCompany } from '@/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { Preloader } from '@/components/ui/Preloader';
import { SearchDropdown } from '@/components/ui/SearchDropdown';
import Image from 'next/image';
import { AddressForm } from './AddressForm';

type CountryType = 'RUS' | 'BY' | 'KZ';

const COUNTRIES = [
    { code: 'RUS' as CountryType, alt: 'Россия', flag: '/icon/flags/ru.svg' },
    { code: 'BY' as CountryType, alt: 'Беларусь', flag: '/icon/flags/by.svg' },
    { code: 'KZ' as CountryType, alt: 'Казахстан', flag: '/icon/flags/kz.svg' },
  ];

interface IProjectFormProps {
    company: ICompany;
    isEditing: boolean;
}

export function CompaniesForm({ company, isEditing}: IProjectFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<CountryType>('RUS');
    const [suggestions, setSuggestions] = useState<Array<{data: IDadataCompany, value: string}>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [formData, setFormData] = useState<ICompany>({
        ID: Number(company.ID),
        Name: company.Name || '',
        INN: company.INN || '',
        KPP: company.KPP || '',
        LegalAddress: company.LegalAddress || '',
        Users: company.Users || [],
        Addresses: company.Addresses || [],
        FullName: company.FullName || '',
        Status: company.Status || false,
    });

    const [mainAddressIndex, setMainAddressIndex] = useState<number>(0);

    const handleImmediateSearch = async (query: string) => {
        if (!query) {
            setSuggestions([]);
            setIsDropdownOpen(false);
            setIsSearching(false);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setIsSearching(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await getDadataCompany(query, selectedCountry);
                setSuggestions(response.suggestions.map(suggestion => ({
                    data: suggestion,
                    value: suggestion.value
                })));
                setIsDropdownOpen(true);
            } catch (error) {
                showToast('Ошибка при поиске компании', 'error');
                setSuggestions([]);
            } finally {
                setLoading(false);
                setIsSearching(false);
            }
        }, 500);
    };

    const handleFocus = () => {
            handleImmediateSearch(searchQuery);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setSearchQuery(newQuery);
        handleImmediateSearch(newQuery);
    };

    const handleSelectCompany = (data: IDadataCompany) => {
        setFormData({
            ...formData,
            Name: data.data.name.short || '',
            FullName: `${data.data.name.short} ${data.data.inn} ${data.data.address.value}`,
            INN: data.data.inn || '',
            KPP: data.data.kpp || '',
            LegalAddress: data.data.address.value || '',
        });
        setIsDropdownOpen(false);
        setSearchQuery(data.data.name.short || '');
    };

    // Закрытие дропдауна при клике вне него
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Также добавим поиск при смене страны
    const handleCountryChange = (country: CountryType) => {
        setSelectedCountry(country);
        if (searchQuery) {
            handleImmediateSearch(searchQuery);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && formData.ID) {
                await updateCompanyById(Number(formData.ID), formData);
            } else {
                await createCompany(formData);
            }
            router.refresh();
            showToast('Компания успешно сохранена', 'success');
        } catch (error) {
            showToast('Ошибка при сохранении компании', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Текст скопирован в буфер обмена', 'success');
    };

    const handleAddAddress = () => {
        setFormData(prev => ({
            ...prev,
            Addresses: [...(prev.Addresses || []), {
                Country: '',
                Region: '',
                City: '',
                Address: '',
            }]
        }));
    };

    const handleAddressChange = (index: number, address: IAddress) => {
        setFormData(prev => ({
            ...prev,
            Addresses: prev.Addresses?.map((addr, i) => i === index ? address : addr) || []
        }));
    };

    const handleMainAddressChange = (index: number) => {
        setMainAddressIndex(index);
    };

    const handleRemoveAddress = (index: number) => {
        setFormData(prev => ({
            ...prev,
            Addresses: prev.Addresses?.filter((_, i) => i !== index) || []
        }));
        if (mainAddressIndex === index) {
            setMainAddressIndex(0);
        } else if (mainAddressIndex > index) {
            setMainAddressIndex(mainAddressIndex - 1);
        }
    };

    return(
        <form onSubmit={handleSubmit} className="relative">
            {loading && <Preloader fullScreen />}
            <div className="mb-6">
                <div className="flex justify-end items-center mb-6 sticky top-0 bg-white z-10 py-4 border-b">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
                        Сохранить компанию
                    </button>
                </div>

                <div>
                    
                </div>
            </div>
            {/* левая колонка */}
            <div className="flex gap-6">
                <div className="w-1/2">
                    <div className="space-y-6 mb-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-end justify-between">
                                <h2 className="font-bold text-lg">Поиск компании</h2>
                                
                                {!isEditing && <div className="flex gap-6 items-center">
                                    {COUNTRIES.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountryChange(country.code)}
                                            className={`p-1 rounded-full transition-all group relative ${
                                                selectedCountry === country.code 
                                                ? 'ring-2 ring-primary ring-offset-2' 
                                                : 'hover:bg-gray-100'
                                            }`}
                                            title={country.alt}
                                        >
                                            <Image 
                                                src={country.flag} 
                                                alt={country.alt} 
                                                width={38} 
                                                height={38}
                                                className="rounded-full"
                                            />
                                        </button>
                                    ))}
                                </div>}
                            </div>

                            {!isEditing && <div className="relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleFocus}
                                    placeholder="Введите название компании или ИНН"
                                    className="w-full border rounded-md px-4 py-2 pr-10"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                
                                <SearchDropdown
                                    isOpen={isDropdownOpen}
                                    isSearching={isSearching}
                                    suggestions={suggestions}
                                    onSelect={handleSelectCompany}
                                    onClose={() => setIsDropdownOpen(false)}
                                    renderSuggestion={(suggestion) => (
                                        <>
                                            <div className="font-medium">{suggestion.data.data.name.short}</div>
                                            <div className="text-sm text-gray-600">
                                                ИНН: {suggestion.data.data.inn}
                                                {suggestion.data.data.kpp && ` / КПП: ${suggestion.data.data.kpp}`}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate">
                                                {suggestion.data.data.address.value}
                                            </div>
                                        </>
                                    )}
                                />
                            </div>}
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        Наименование:
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.FullName || formData.Name || ''}
                                        className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-36 pr-10"
                                        title={formData.FullName || formData.Name || ''}
                                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                        disabled={isEditing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopyToClipboard(formData.FullName || formData.Name || '')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
                                    >
                                        <Image src="/icon/action/copy.svg" alt="Копировать" width={20} height={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        ИНН:
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.INN || ''}
                                        className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-16 pr-10"
                                        title={formData.INN || ''}
                                        onChange={(e) => setFormData({ ...formData, INN: e.target.value })}
                                        disabled={isEditing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopyToClipboard(formData.INN || '')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
                                    >
                                        <Image src="/icon/action/copy.svg" alt="Копировать" width={20} height={20} />
                                    </button>
                                </div>
                                <div className="w-1/2 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        КПП:
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.KPP || ''}
                                        className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-16 pr-10"
                                        title={formData.KPP || ''}
                                        onChange={(e) => setFormData({ ...formData, KPP: e.target.value })}
                                        disabled={isEditing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopyToClipboard(formData.KPP || '')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
                                    >
                                        <Image src="/icon/action/copy.svg" alt="Копировать" width={20} height={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        Юр. адрес:
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.LegalAddress ||''}
                                        className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-28 pr-10"
                                        title={formData.LegalAddress || ''}
                                        onChange={(e) => setFormData({ ...formData, LegalAddress: e.target.value })}
                                        disabled={isEditing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopyToClipboard(formData.LegalAddress || '')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
                                    >
                                        <Image src="/icon/action/copy.svg" alt="Копировать" width={20} height={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">Адреса доставки</h2>
                            <button
                                type="button"
                                onClick={handleAddAddress}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <Image src="/icon/action/plus.svg" alt="Добавить адрес" width={24} height={24} />
                            </button>
                        </div>

                        {formData.Addresses?.map((address, index) => (
                            <AddressForm
                                key={index}
                                index={index}
                                address={address}
                                isMainAddress={index === mainAddressIndex}
                                onAddressChange={handleAddressChange}
                                onMainAddressChange={handleMainAddressChange}
                                onRemove={handleRemoveAddress}
                            />
                        ))}
                    </div>
                </div>

                {/* правая колонка */}
                <div className="w-1/2">
                    DataTabl
                </div>
                
            </div>
        </form>
    );
}