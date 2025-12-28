import React from 'react';
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
    onRightIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, leftIcon, rightIcon, className = '', containerClassName = '', onRightIconClick, ...props }, ref) => {
        const inputId = props.id || props.name || `input-${Math.random()}`;

        return (
            <div className={cn("w-full space-y-2", containerClassName)}>
                {label && (
                    <Label
                        htmlFor={inputId}
                        className="text-sm font-semibold text-gray-700"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                )}

                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600 pointer-events-none z-10">
                            {leftIcon}
                        </div>
                    )}

                    <ShadcnInput
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "h-12 bg-gray-50 border-gray-200 rounded-xl",
                            "focus-visible:bg-white focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                            "placeholder:text-gray-400 hover:border-gray-300 transition-all duration-200",
                            leftIcon && "pl-12",
                            rightIcon && "pr-12",
                            error && "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-100",
                            className
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <div
                            className={cn(
                                "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors z-10",
                                onRightIconClick ? "cursor-pointer hover:text-gray-600" : "pointer-events-none"
                            )}
                            onClick={onRightIconClick}
                        >
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-red-600 font-medium animate-fade-in">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-xs text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
