import { useState, useEffect, useRef } from 'react';
//import { useUserId } from './UserIdProvider';

export interface ColumnVisibility {
  Name: boolean;
  Price: boolean;
  SKU: boolean;
  Power: boolean;
  LuminousFlux: boolean;
  Efficiency: boolean;
  ColorTemp: boolean;
  CRI: boolean;
  ProtectionClass: boolean;
  ClimateExecution: boolean;
  EmergencyPowerUnit: boolean;
  BeamAngle: boolean;
  Warranty: boolean;
}

interface ColumnVisibilityManagerProps {
  visibleColumns: ColumnVisibility;
  onColumnToggle: (column: keyof ColumnVisibility) => void;
  onReset: () => void;
  Category: string;
}

export const ColumnVisibilityManager = ({ 
  visibleColumns, 
  onColumnToggle,
  onReset,
  Category 
}: ColumnVisibilityManagerProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
 // const userId = useUserId();

  useEffect(() => {
    const savedColumns = localStorage.getItem(`columns-${Category}`);
    if (savedColumns) {
      const parsedColumns: ColumnVisibility = JSON.parse(savedColumns);
      // Здесь можно обновить состояние видимости колонок, если нужно
    }
  }, [Category]);

  useEffect(() => {
    localStorage.setItem(`columns-${Category}`, JSON.stringify(visibleColumns));
  }, [Category, visibleColumns]);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const columnLabels: Record<keyof ColumnVisibility, string> = {
    Name: 'Название',
    Price: 'Цена',
    SKU: 'SKU',
    Power: 'Мощность',
    LuminousFlux: 'Световой поток',
    Efficiency: 'Эффективность',
    ColorTemp: 'Цветовая температура',
    CRI: 'CRI',
    ProtectionClass: 'Класс защиты',
    ClimateExecution: 'Климатическое исполнение',
    EmergencyPowerUnit: 'Аварийный блок питания',
    BeamAngle: 'Угол луча',
    Warranty: 'Гарантия'
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-end">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ⋮
        </button>
        {showMenu && (
          <div ref={menuRef} className="absolute top-10 right-0 bg-white shadow-lg rounded p-4 z-10">
            <div className="flex flex-col gap-2">
              {(Object.keys(visibleColumns) as Array<keyof ColumnVisibility>).map(column => (
                <label key={column} className="flex items-center gap-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={visibleColumns[column]}
                    onChange={() => onColumnToggle(column)}
                    className="form-checkbox"
                  />
                  {columnLabels[column]}
                </label>
              ))}
              <button 
                onClick={onReset}
                className="mt-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Сбросить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const defaultColumns: ColumnVisibility = {
  Name: true,
  Price: true,
  SKU: true,
  Power: false,
  LuminousFlux: false,
  Efficiency: false,
  ColorTemp: false,
  CRI: false,
  ProtectionClass: false,
  ClimateExecution: false,
  EmergencyPowerUnit: false,
  BeamAngle: false,
  Warranty: false,
}; 