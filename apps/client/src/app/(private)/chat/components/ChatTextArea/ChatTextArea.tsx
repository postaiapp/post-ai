'use client';

import React, { forwardRef, useCallback, useRef, useState } from 'react';

import { TextAreaProps } from '@common/interfaces/ui';
import { Button } from '@components/button';
import { cn } from '@lib/utils';
import clsx from 'clsx';
import { ArrowUp } from 'lucide-react';

const ChatTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	(
		{
			info,
			error,
			size = 'default',
			disabled = false,
			maxLength,
			numberOfLines = 2,
			maxNumberOfLines = 4,
			containerClassName,
			showCount = false,
			className,
			value,
			onChange,
			onEnter,
			...props
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const textareaRef = useRef<HTMLTextAreaElement | null>(null);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLTextAreaElement>) => {
				const textarea = textareaRef.current;
				if (textarea) {
					textarea.style.height = 'auto';
					textarea.style.height = `${Math.min(textarea.scrollHeight, maxNumberOfLines * 1.5 * 16)}px`;
				}
				onChange?.(e);
			},
			[onChange, maxNumberOfLines]
		);

		const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				if (disabled) return;
				onEnter?.();
			}
		};

		const inputClasses = cn(
			'resize-none p-3 rounded-md transition-colors text-gray-800 outline-none focus:outline-none w-full',
			size === 'small' ? 'text-sm' : 'text-base',
			isFocused ? 'border-none' : 'border-gray-300',
			error ? 'border-red-500' : '',
			className
		);

		return (
			<div className="flex flex-col gap-2 w-full">
				<div
					className={clsx(
						'border border-gray-300 bg-white rounded-md flex flex-col items-end h-[100px]',
						containerClassName
					)}
				>
					<textarea
						ref={(el) => {
							textareaRef.current = el;
							if (typeof ref === 'function') ref(el);
							else if (ref) ref.current = el;
						}}
						style={{
							overflowY: 'auto',
							scrollbarWidth: 'thin',
							scrollbarColor: '#c89bf2 #F3F4F6',
						}}
						className={inputClasses}
						value={value}
						onKeyDown={handleKeyDown}
						onChange={handleChange}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						maxLength={maxLength}
						rows={numberOfLines}
						{...props}
					/>
					<Button
						type="submit"
						disabled={disabled}
						onClick={onEnter}
						className={'flex mt-auto bg-purple-400 border-none shadow-none justify-center w-8 h-8 m-1'}
					>
						<ArrowUp className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex justify-between items-center">
					{info && !error && <p className="text-gray-500 text-sm">{info}</p>}
					{error && <p className="text-red-500 text-sm">{error}</p>}
					{showCount && maxLength && (
						<p className="text-gray-500 text-sm">
							{value?.toString().length}/{maxLength}
						</p>
					)}
				</div>
			</div>
		);
	}
);

ChatTextArea.displayName = 'TextArea';

export default ChatTextArea;
