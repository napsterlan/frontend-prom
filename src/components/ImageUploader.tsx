'use client';

interface ImageUploaderProps {
    existingImages: Array<{ ImageURL: string; AltText: string; ID?: number }>;
    onImagesChange: (files: File[]) => void;
    onDeleteImage: (id: number) => void;
}

export function ImageUploader({ existingImages, onImagesChange, onDeleteImage }: ImageUploaderProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onImagesChange(Array.from(e.target.files));
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {existingImages.map((image, index) => (
                    <div key={image.ID || index} className="relative group">
                        <img
                            src={image.ImageURL}
                            alt={image.AltText || 'Uploaded image'}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        {image.ID && (
                            <button
                                type="button"
                                onClick={() => onDeleteImage(image.ID!)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
            <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />
        </div>
    );
} 