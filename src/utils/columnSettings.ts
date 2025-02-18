import { ColumnVisibility } from '@/app/_components/ColumnVisibilityManager';

// Настройки по умолчанию для разных категорий
export const categoryDefaultColumns: Record<string, ColumnVisibility> = {
  'kategorii': {
    Name: true,
    Price: true,
    SKU: true,
    Power: true,
    LuminousFlux: true,
    Efficiency: true,
    ColorTemp: false,
    CRI: false,
    ProtectionClass: false,
    ClimateExecution: false,
    EmergencyPowerUnit: false,
    BeamAngle: false,
    Warranty: true,
  },
  // Добавьте другие категории с их настройками по умолчанию
};

// Получение настроек колонок для категории
export const getColumnSettings = (category: string): ColumnVisibility => {
  if (typeof window === 'undefined') {
    // Если код выполняется на сервере, возвращаем настройки по умолчанию
    return categoryDefaultColumns[category] || {
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
  }

  // Код выполняется в браузере, можно использовать localStorage
  const userSettings = localStorage.getItem(`columns-${category}`);
  if (userSettings) {
    return JSON.parse(userSettings);
  }

  return categoryDefaultColumns[category] || {
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
}; 