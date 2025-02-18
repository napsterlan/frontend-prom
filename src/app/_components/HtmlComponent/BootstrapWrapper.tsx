import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface BootstrapWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const BootstrapWrapper: React.FC<BootstrapWrapperProps> = ({
  children,
  className = ''
}) => {
    return (
        <div className={`bootstrap-content ${className}`}>
            {children}
        </div>
    );
};