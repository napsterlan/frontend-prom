import { useCallback } from 'react';
import { debounce } from 'lodash';
import { LexicalEditor } from '@/app/_components/LexicalEditor/LexicalEditor';

interface IFormEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  error?: string;
}

export function FormEditor({ 
  initialContent = '', 
  onChange,
  error 
}: IFormEditorProps) {
  // Create a debounced version of the onChange callback
  const debouncedOnChange = useCallback(
    debounce((content: string) => {
      onChange(content);
    }, 1000), // 1 second delay
    [onChange]
  );

  const handleEditorChange = useCallback((content: string) => {
    debouncedOnChange(content);
  }, [debouncedOnChange]);
  return (
    <div className="w-full mb-6">
      <h2 className="text-2xl font-bold mb-4">Описание проекта</h2>
      <div className={`w-full ${error ? 'border-2 border-red-500 rounded-md' : ''}`}>
        <LexicalEditor
          initialContent={initialContent}
          onChange={handleEditorChange}
          className="prose max-w-none"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 