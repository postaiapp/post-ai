import { forwardRef } from 'react';

import { ButtonProps } from '@common/interfaces/ui';
import { cn } from '@lib/utils';
import { Loader2 } from 'lucide-react';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, isLoading, children, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition',
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
