import { useState, useRef, useEffect } from 'react';
import { ICategory, IProjectCategory } from '@/types';

interface IFormRelationsProps {
    projectCategories?: IProjectCategory[] | [];
    productCategories: ICategory[];
    selectedProjectCategories: number[];
    onCategoriesChange: (categories: number[]) => void;
    error?: string;
}

export function FormProjectCategoriesRelations({
    projectCategories, 
    productCategories,
    selectedProjectCategories,
    onCategoriesChange,
    error 
}: IFormRelationsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<IProjectCategory[] | [] | undefined>(projectCategories || []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFilteredCategories(projectCategories || []);
  }, [projectCategories]);

  const handleCategorySearch = (searchValue: string) => {
    const filtered = projectCategories?.filter(cat => 
      cat.Name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  return (
    <div className="space-y-6">
        <div>
          <div>
            <label className="block mb-2 text-lg font-bold">Показывать в категориях</label>
          
          {/* Выбранные категории (чипы) */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedProjectCategories.map((id, index) => {
              const category = projectCategories?.find(cat => cat.ID === id);

              if (!category) return null;
              
              const isMainCategory = index === 0; // Первая(нулевая) категория всегда главная
              
              return (
                <div
                  key={id}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    isMainCategory 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                  title={isMainCategory ? "Главная категория" : ""}
                >
                  <span>{category.Name}</span>
                  <button
                    type="button"
                    className={`ml-1 hover:text-red-800 ${
                      isMainCategory ? 'text-green-600' : 'text-blue-600'
                    }`}
                    onClick={() => {
                      const newCategories = selectedProjectCategories.filter(
                        (catId) => catId !== id
                      );
                      
                      onCategoriesChange(newCategories);
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}

          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
              placeholder="Поиск категорий..."
              onChange={(e) => {
                handleCategorySearch(e.target.value);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            
            {/* Выпадающий список */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                {filteredCategories?.map((category) => (
                  <div
                    key={category.ID}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                        selectedProjectCategories.includes(category.ID) 
                        ? selectedProjectCategories[0] === category.ID 
                          ? 'bg-green-50' 
                          : 'bg-blue-50' 
                        : ''
                    }`}
                    onClick={() => {
                      const isSelected = selectedProjectCategories.includes(category.ID);
                      let newCategories;
                      
                      if (isSelected) {
                        // Удаляем категорию
                        newCategories = selectedProjectCategories.filter((id) => id !== category.ID);
                      } else {
                        // Добавляем категорию
                        newCategories = [...selectedProjectCategories, category.ID];
                      }
                      
                      onCategoriesChange(newCategories);
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
    </div>
  );
} 