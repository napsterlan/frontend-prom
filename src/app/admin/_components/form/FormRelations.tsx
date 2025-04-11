import { useState, useRef, useEffect } from 'react';
import { IProjectCategory } from '@/types';

interface IFormRelationsProps {
  categories: IProjectCategory[];
  selectedCategories: number[];
  onCategoriesChange: (categories: number[]) => void;
  error?: string;
}

export function FormRelations({ 
  categories, 
  selectedCategories, 
  onCategoriesChange,
  error 
}: IFormRelationsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<IProjectCategory[]>(categories);
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

  console.log('categories', categories);
  console.log('filteredCategories', filteredCategories);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleCategorySearch = (searchValue: string) => {
    const filtered = categories.filter(cat => 
      cat.Name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <div>
          <label className="block mb-2">Показывать в категориях</label>
          
          {/* Выбранные категории (чипы) */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCategories.map((id, index) => {
              const category = categories.find(cat => cat.ID === id);

              if (!category) return null;
              
              const isMainCategory = index === 0; // Первая(нулевая) категория всегда главная
              
              return (
                <div
                  key={id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
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
                      const newCategories = selectedCategories.filter(
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
                      selectedCategories.includes(category.ID) 
                        ? selectedCategories[0] === category.ID 
                          ? 'bg-green-50' 
                          : 'bg-blue-50' 
                        : ''
                    }`}
                    onClick={() => {
                      const isSelected = selectedCategories.includes(category.ID);
                      let newCategories;
                      
                      if (isSelected) {
                        // Удаляем категорию
                        newCategories = selectedCategories.filter((id) => id !== category.ID);
                      } else {
                        // Добавляем категорию
                        newCategories = [...selectedCategories, category.ID];
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