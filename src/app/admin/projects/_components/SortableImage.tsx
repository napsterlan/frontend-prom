import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableImageProps {
  image: {
    ID?: number;
    ImageURL: string;
    AltText: string;
    Order: number;
    isNew?: boolean;
  };
  index: number;
  onDelete: () => void;
}

export function SortableImage({ image, index, onDelete }: SortableImageProps) {
  const { 
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: `${image.ID || image.ImageURL}-${index}`,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : '',
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative group aspect-square ${isDragging ? 'z-50' : ''}`}
    >
      <div 
        {...listeners}
        className={`absolute inset-2 border rounded-lg overflow-hidden bg-white ${
          isDragging ? 'shadow-xl cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <Image
          src={image.ImageURL}
          alt={image.AltText || 'Project image'}
          width={200}
          height={200}
          className="w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />
        <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded text-sm pointer-events-none">
          {index + 1}
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-4 right-4 bg-black text-white rounded px-1.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
} 