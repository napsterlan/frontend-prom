import { IDadataAddress } from '@/types';
import { IAddress } from '@/types/userTypes';
import { getDadataAddress } from '@/api';
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { SearchDropdown } from '@/components/ui/SearchDropdown';
import Image from 'next/image';

interface AddressFormProps {
    index: number;
    address: IAddress;
    isMainAddress: boolean;
    onAddressChange: (index: number, address: IAddress) => void;
    onMainAddressChange: (index: number) => void;
    onRemove: (index: number) => void;
}

export function AddressForm({
    index,
    address,
    isMainAddress,
    onAddressChange,
    onMainAddressChange,
    onRemove
}: AddressFormProps) {
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Array<{data: IDadataAddress, value: string}>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                const response = await getDadataAddress(query);
                setSuggestions(response.suggestions.map(suggestion => ({
                    data: suggestion,
                    value: suggestion.value
                })));
                setIsDropdownOpen(true);
            } catch (error) {
                showToast('Ошибка при поиске адреса', 'error');
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const handleSelectAddress = (data: IDadataAddress) => {
        const newAddress: IAddress = {
            Country: data.data.country || '',
            Region: data.data.region || '',
            City: data.data.city || data.data.settlement || '',
            Address: data.data.street ? `${data.data.street} ${data.data.house || ''} ${data.data.flat || ''}`.trim() : '',
        };
        onAddressChange(index, newAddress);
        setIsDropdownOpen(false);
        setSearchQuery(data.value);
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Текст скопирован в буфер обмена', 'success');
    };

    return (
        <div className='mb-8'>
            {index !== 0 && <div className="mb-8 border-t border-gray-200"></div>}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="font-medium">Адрес {index + 1}</h3>
                    <div 
                        onClick={() => onMainAddressChange(index)}
                        className="flex items-center gap-2 cursor-pointer select-none"
                        title={!isMainAddress ? "сделать главным адресом доставки" : undefined}
                    >
                        <div className={`w-8 h-4 rounded-full transition-colors ${isMainAddress ? 'bg-blue-500' : 'bg-gray-300'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transform transition-transform mt-0.5 ${isMainAddress ? 'translate-x-4' : 'translate-x-1'}`} />
                        </div>
                        {isMainAddress && <span className="text-xs text-gray-500">Главный адрес доставки</span>}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                >
                    <Image src="/icon/action/delete.svg" alt="Удалить" width={22} height={22} />
                </button>
            </div>

            <div className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleImmediateSearch(e.target.value);
                        }}
                        placeholder="Введите адрес"
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
                        onSelect={handleSelectAddress}
                        onClose={() => setIsDropdownOpen(false)}
                        renderSuggestion={(suggestion) => (
                            <div className="text-sm text-gray-600">{suggestion.value}</div>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            Страна:
                        </span>
                        <input
                            type="text"
                            value={address.Country}
                            onChange={(e) => onAddressChange(index, { ...address, Country: e.target.value })}
                            className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-24"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            Рег./Обл.:
                        </span>
                        <input
                            type="text"
                            value={address.Region}
                            onChange={(e) => onAddressChange(index, { ...address, Region: e.target.value })}
                            className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-24"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            Город:
                        </span>
                        <input
                            type="text"
                            value={address.City}
                            onChange={(e) => onAddressChange(index, { ...address, City: e.target.value })}
                            className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-24"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            Адрес:
                        </span>
                        <input
                            type="text"
                            value={address.Address}
                            onChange={(e) => onAddressChange(index, { ...address, Address: e.target.value })}
                            className="w-full bg-gray-50 border rounded-md px-4 py-2 pl-24 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => handleCopyToClipboard(address.Address || '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
                        >
                            <Image src="/icon/action/copy.svg" alt="Копировать" width={20} height={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 