import * as React from 'react';

import { cn } from '@lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none',
	{
		variants: {
			variant: {
				primary: 'bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow hover:opacity-90',
				secondary: 'bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50',
				tertiary: 'bg-transparent text-gray-800 hover:bg-gray-100',
				destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
				outline: 'border border-purple-500 bg-background shadow-sm hover:bg-purple-50 hover:text-purple-700',
				ghost: 'hover:bg-purple-50 hover:text-purple-700',
				link: 'text-purple-600 underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 p-3',
				sm: 'h-8 rounded-md px-2 py-2 text-sm',
				lg: 'h-12 rounded-lg px-4 py-2 text-lg',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	icon?: React.ReactNode;
	iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			disabled,
			asChild = false,
			loading = false,
			icon,
			iconPosition = 'left',
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		const isDisabled = disabled || loading;
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }), isDisabled && 'cursor-not-allowed')}
				ref={ref}
				disabled={isDisabled}
				{...props}
			>
				{iconPosition === 'left' && icon && <span className={cn('mr-1', 'flex items-center')}>{icon}</span>}
				{children}
				{loading && <LoaderCircle className="animate-spin ml-1 w-5 h-5" />}
				{iconPosition === 'right' && icon && <span className={cn('ml-1', 'flex items-center')}>{icon}</span>}
			</Comp>
		);
	}
);

Button.displayName = 'Button';

export { Button, buttonVariants };
