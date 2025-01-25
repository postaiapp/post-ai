import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    info?: string;
    error?: string;
    size?: 'small' | 'default';
    iconRight?: React.ReactNode;
    iconDisabled?: boolean;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
    containerClassName?: string;
    showCount?: boolean;
    numberOfLines?: number;
    maxNumberOfLines?: number;
}

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    className?: string;
    isLoading?: boolean;
    children: ReactNode;
}

export { ButtonProps, TextAreaProps };
