import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableImage } from '@/app/admin/_components/SortableImage';
import { IImages } from '@/types';

interface IFormImage {
    ID?: number | null;
    ImageURL: string;
    AltText: string;
    Order: number;
    ShortURL?: string;
    file?: File;
    IsNew?: boolean;
}

interface ProjectImagesProps {
    existingImages: IFormImage[];
    onImagesChange: (images: IFormImage[]) => void;
    onDeleteImages: (deletedIds: number[]) => void;
    maxImages: number;
    errors?: {
        Images?: string;
    };
    inputId?: string;
    imagesRow?: number;
}

export function FormImageGallery({ 
  existingImages, 
  onImagesChange, 
  onDeleteImages,
  maxImages,
  errors,
  inputId = 'file-upload',
  imagesRow = 4
}: ProjectImagesProps) {
  const [deletedImages, setDeletedImages] = useState<number[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    if (existingImages.length + newFiles.length > maxImages) {
      alert(`Максимальное количество изображений: ${maxImages}`);
      return;
    }

    const newPreviewImages = newFiles.map((file, index) => ({
      ImageURL: URL.createObjectURL(file),
      AltText: '',
      Order: existingImages.length + index,
      IsNew: true,
      file: file
    }));

    onImagesChange([...existingImages, ...newPreviewImages]);
  };

  const handleImageDelete = (index: number) => {
    const imageToDelete = existingImages[index];
    
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    onImagesChange(newExistingImages);
    
    if (imageToDelete.ID) {
      const newDeletedImages = [...deletedImages, imageToDelete.ID];
      setDeletedImages(newDeletedImages);
      onDeleteImages(newDeletedImages);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = existingImages.findIndex((img, i) => 
      `${img.ID || img.ImageURL}-${i}` === active.id
    );
    const newIndex = existingImages.findIndex((img, i) => 
      `${img.ID || img.ImageURL}-${i}` === over.id
    );

    const reorderedImages = arrayMove(existingImages, oldIndex, newIndex);
    const updatedImages = reorderedImages.map((img, i) => ({
      ...img,
      Order: i
    }));

    onImagesChange(updatedImages);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4,
        tolerance: 3,
        delay: 0
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="mb-4">
        <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
            accept="image/*"
            disabled={existingImages.length >= maxImages}
        />
        <label 
            htmlFor={inputId} 
            className={`inline-block px-4 py-2 rounded-md cursor-pointer ${
                existingImages.length >= maxImages 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
            {existingImages.length >= maxImages 
                ? 'Достигнут лимит изображений' 
                : 'Добавить изображения'
            }
        </label>
        <div className="text-sm text-gray-500 mt-2">
            {`${existingImages.length}/${maxImages} изображений`}
        </div>
        {errors?.Images && (
            <p className="text-red-500 text-sm mt-1">{errors.Images}</p>
        )}

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={existingImages.map((image, index) => `${image.ID || image.ImageURL}-${index}`)}
                strategy={rectSortingStrategy}
            >
                <div className={`grid mt-4 ${
                    imagesRow === 4 ? 'grid-cols-4' : 
                    imagesRow === 3 ? 'grid-cols-3' : 
                    imagesRow === 2 ? 'grid-cols-2' : 
                    'grid-cols-1'
                }`}>
                    {existingImages.map((image, index) => (
                        <SortableImage
                        key={`${image.ID || image.ImageURL}-${index}`}
                        image={image}
                        index={index}
                        onDelete={() => handleImageDelete(index)}
                    />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    </div>
  );
} 