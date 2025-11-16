import type { ComponentProps } from 'react';
import clsx from 'clsx';

export const Button = ({children, className, ...props}: ComponentProps<'button'>) => (
    <button
        {...props}
        className={clsx('px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', className)}
    >
        {children}
    </button>
);
