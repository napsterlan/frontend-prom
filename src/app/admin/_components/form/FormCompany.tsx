import { useState, useRef, useEffect } from 'react';
import { getAllCompanies } from '@/api';
import { ICompany } from '@/types/userTypes';
import { useSession } from 'next-auth/react'
import Link from 'next/link';

interface IFormCompanyProps {
    companies?: ICompany[]
    setCompanies: (companies: ICompany[]) => void;
    label: string;
}

export function FormCompany({
    companies,
    setCompanies,
    label,
}: IFormCompanyProps) {
    // Все доступные категории из API
    const [allCompanies, setAllCompanies] = useState<ICompany[]>([]);
    // Отфильтрованные категории для поиска
    const [filteredCompanies, setFilteredCompanies] = useState<ICompany[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const session = useSession()

    useEffect(() => {
        if (isDropdownOpen) {
            setIsLoading(true);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            
            searchTimeoutRef.current = setTimeout(() => {
                handleCompanySearch();
            }, searchQuery.length > 0 ? 1000 : 0);
        }
        
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [isDropdownOpen, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
    // Поиск по всем доступным компаниям
    const handleCompanySearch = async () => {
        try {
            const response = await getAllCompanies({searchQuery: searchQuery, sessionToken: session?.data?.jwt});
            setFilteredCompanies(response.data.map((company: ICompany) => ({
                ...company,
                FullName: `
                    ${company.Name || ''} 
                    ${company.INN ? " / ИНН:" + company.INN : ''} 
                    ${company.KPP ? " / КПП:" + company.KPP : ''} 
                    ${company.LegalAddress ? " / Юр.адрес: " + company.LegalAddress : ''}
                    ${company.Addresses?.[0]?.Address ? " / Физ.адрес: " + company.Addresses[0].Address : ''}
                `
            })));
        } catch (err) {
            console.error('Ошибка при поиске компаний:', err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Отображение выбранных категорий из пропсов
    const renderSelectedCompanies = () => { 
        if (Array.isArray(companies)) {
                return companies.map((company) => (
                    <div
                        key={company.ID}
                    className="flex items-center justify-between rounded-full px-3 py-2 bg-blue-100 text-blue-800 rounded"
                >
                    <Link href={`/admin/companies/${company.ID}`} target="_blank" className="hover:underline">{company.FullName}</Link>                <button
                        type="button"
                        className="text-blue-600 hover:text-red-800"
                        onClick={() => setCompanies(companies?.filter(c => c.ID !== company.ID) || [])}
                    >
                        ×
                    </button>
                </div>
            ));
        }
    };
    return (
        <div className="space-y-6 mt-6">
            <div>
                <label className="block mb-2 text-lg font-bold">{label}</label>
                
                <div className="flex flex-col gap-2 mb-4">
                    {renderSelectedCompanies()}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Поиск категорий..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsDropdownOpen(true)}
                        />
                        {isLoading && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                            {!isLoading && filteredCompanies && filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company) => (
                                    <div
                                        key={company.ID}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                            companies?.some(item => item.ID === company.ID) ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => {
                                            const isSelected = companies?.some(item => item.ID === company.ID);
                                            
                                            if (isSelected) {
                                                setCompanies(companies?.filter(c => c.ID !== company.ID) || []);
                                            } else {
                                                setCompanies([...(companies || []), company]);
                                            }
                                        }}
                                    >
                                        {company.FullName}
                                    </div>
                                ))
                            ) : !isLoading && (
                                <div className="p-2 text-gray-500 text-center">
                                    Ничего не найдено
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}