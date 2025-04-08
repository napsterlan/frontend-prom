'use client';

interface EditorProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
}

export function Editor({ label, value, onChange }: EditorProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-[200px] p-3 border rounded-md"
            />
        </div>
    );
} 