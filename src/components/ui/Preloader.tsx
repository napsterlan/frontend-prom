import React from 'react';

interface PreloaderProps {
  fullScreen?: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center'
    : 'relative w-full h-full min-h-[100px] flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    </div>
  );
}; 