"use client";

import React, { forwardRef, useState, useCallback } from "react";

import { TextAreaProps } from "@common/interfaces/ui";
import { cn } from "@lib/utils";
import clsx from "clsx";

import { Button } from "./ui/button";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      info,
      error,
      size = "default",
      iconRight,
      iconDisabled = false,
      disabled = false,
      required,
      maxLength,
      containerClassName,
      showCount = false,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [length, setLength] = useState(value?.toString().length || 0);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLength(e.target.value.length);
        onChange?.(e);
      },
      [onChange]
    );

    const inputClasses = cn(
      "resize-none p-3 rounded-md transition-colors text-gray-800 outline-none focus:outline-none w-full",
      size === "small" ? "text-sm" : "text-base",
      isFocused ? "border-none" : "border-gray-300",
      error ? "border-red-500" : "",
      disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "",
      className
    );

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <p className="text-gray-800 text-sm">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </p>
        )}

        <div
          className={clsx(
            "border border-gray-300 rounded-md flex items-center",
            containerClassName
          )}
        >
          <textarea
            ref={ref}
            className={inputClasses}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            disabled={disabled}
            {...props}
          />
          {iconRight && (
            <Button
              type="button"
              disabled={iconDisabled}
              className={cn(
                "flex mt-auto bg-transparent border-none shadow-none hover:bg-white justify-center w-8 h-8",
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              {iconRight}
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center">
          {info && !error && <p className="text-gray-500 text-sm">{info}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {showCount && maxLength && (
            <p className="text-gray-500 text-sm">
              {length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
