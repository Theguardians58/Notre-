// Loading spinner component
import { FC } from 'react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: FC<SpinnerProps> = ({ size = 'md' }) => {
  return (
    <div
      className={clsx('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', {
        'h-4 w-4': size === 'sm',
        'h-8 w-8': size === 'md',
        'h-12 w-12': size === 'lg',
      })}
    />
  );
};
