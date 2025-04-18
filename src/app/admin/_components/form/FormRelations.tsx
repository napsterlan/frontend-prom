import { useState, useRef, useEffect } from 'react';
import { getCategoriesTree } from '@/api';
import { ICategoryTreeById } from '@/types';

interface IFormRelationsProps {
    categories?: ICategoryTreeById[]; // массив объектов категорий по {ID: number, Name: string}
    setCategories: (categories: ICategoryTreeById[]) => void;
    label: string;
}

export function FormRelations({
    categories,
    setCategories,
    label
}: IFormRelationsProps) {
    // Все доступные категории из API
    const [allCategories, setAllCategories] = useState<ICategoryTreeById[]>([]);
    // Отфильтрованные категории для поиска
    const [filteredCategories, setFilteredCategories] = useState<ICategoryTreeById[]>([]);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    

    // Загрузка всех доступных категорий при открытии дропдауна
    const loadCategories = async () => {
        try {
            const response = await getCategoriesTree();
            setAllCategories(response.data);
            setFilteredCategories(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке категорий:', err);
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            loadCategories();
        }
    }, [isDropdownOpen]);

    // const handleDropdownToggle = async () => {
    //     if (!isDropdownOpen) {
    //         await loadCategories();
    //     }
    //     setIsDropdownOpen(!isDropdownOpen);
    // };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
      
    // Поиск по всем доступным категориям
    const handleCategorySearch = async (searchQuery: string) => {
        if (searchQuery.trim()) {
            try {
                const response = await getCategoriesTree(searchQuery);
                setFilteredCategories(response.data);
            } catch (err) {
                console.error('Ошибка при поиске категорий:', err);
            }
        } else {
            setFilteredCategories(allCategories);
        }
    };
    
    // Отображение выбранных категорий из пропсов
    const renderSelectedCategories = () => {
        return categories?.map((category) => (
            <div
                key={category.ID}
                className="flex items-center justify-between rounded-full px-3 py-2 bg-blue-100 text-blue-800 rounded"
            >
                <span>{category.Name}</span>
                <button
                    type="button"
                    className="text-blue-600 hover:text-red-800"
                    onClick={() => setCategories(categories?.filter(c => c.ID !== category.ID) || [])}
                >
                    ×
                </button>
            </div>
        ));
    };
    return (
        <div className="space-y-6 mt-6">
            <div>
                <label className="block mb-2 text-lg font-bold">{label}</label>
                
                <div className="flex flex-col gap-2 mb-4">
                    {renderSelectedCategories()}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Поиск категорий..."
                        onChange={(e) => handleCategorySearch(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                    />
                    
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                            {filteredCategories && filteredCategories.length > 0 && filteredCategories.map((category, index) => (
                                <div
                                    key={category.ID}
                                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                        categories?.some(item => item.ID === category.ID) ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => {
                                        const isSelected = categories?.some(item => item.ID === category.ID);
                                        
                                        if (isSelected) {
                                            setCategories(categories?.filter(c => c.ID !== category.ID) || []);
                                        } else {
                                            setCategories([...(categories || []), category]);
                                        }
                                    }}
                                >
                                    {category.Name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}