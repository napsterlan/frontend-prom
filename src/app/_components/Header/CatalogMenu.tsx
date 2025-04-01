'use client'

interface CatalogMenuProps {
    isVisible: boolean
    onMouseEnter: (event: React.MouseEvent) => void
    onMouseLeave: (event: React.MouseEvent) => void
}

export default function CatalogMenu({ isVisible, onMouseEnter, onMouseLeave }: CatalogMenuProps) {
    if (!isVisible) return null

    return (
        <div className="w-full h-[525px] relative z-50 bottom-[35px] flex justify-center">
            <div 
                id="catalog-menu" 
                className="flex items-end h-full w-max"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className="shadow-lg w-[800px] h-[500px] bg-white border-t-3 border-PLGreen rounded-[5px]">
                    {/* Содержимое каталога */}
                </div>
            </div>
        </div>
    )
} 