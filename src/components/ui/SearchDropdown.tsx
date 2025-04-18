'use client';

import { useEffect, useRef } from 'react';
import { SearchSuggestion } from '@/types';

interface SearchDropdownProps<T> {
    isOpen: boolean;
    isSearching: boolean;
    suggestions: SearchSuggestion<T>[];
    onSelect: (data: T) => void;
    renderSuggestion: (suggestion: SearchSuggestion<T>) => React.ReactNode;
    onClose: () => void;
}

export function SearchDropdown<T>({ 
    isOpen, 
    isSearching, 
    suggestions, 
    onSelect, 
    renderSuggestion,
    onClose 
}: SearchDropdownProps<T>) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[450px] overflow-auto" ref={dropdownRef}>
            {isSearching ? (
                <div className="p-4 flex justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => onSelect(suggestion.data)}
                    >
                        {renderSuggestion(suggestion)}
                    </div>
                ))
            ) : (
                <div className="p-4 text-center text-gray-500">
                    Ничего не найдено
                </div>
            )}
        </div>
    );
} 