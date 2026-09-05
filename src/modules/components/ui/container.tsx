import React, { forwardRef } from 'react';
import { cn } from './utils';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: React.ElementType;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',     // 672px - Articles, focused forms
  md: 'max-w-4xl',     // 896px - Settings, medium dashboards
  lg: 'max-w-6xl',     // 1152px - Standard page grids
  xl: 'max-w-7xl',     // 1280px - Primary site container
  full: 'max-w-full',  // 100% width
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'xl', as: Component = 'div', className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'w-full mx-auto px-4 sm:px-6 lg:px-8',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
