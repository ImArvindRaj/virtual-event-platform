import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gradient' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    // Map legacy variants to shadcn variants + custom classes
    const getVariantConfig = () => {
        switch (variant) {
            case 'primary':
                return { variant: 'default' as const, className: 'bg-indigo-600 hover:bg-indigo-700' };
            case 'secondary':
                return { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-900 hover:bg-gray-200' };
            case 'success':
                return { variant: 'default' as const, className: 'bg-green-600 hover:bg-green-700' };
            case 'danger':
                return { variant: 'destructive' as const, className: '' };
            case 'ghost':
                return { variant: 'ghost' as const, className: '' };
            case 'gradient':
                return {
                    variant: 'default' as const,
                    className: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0'
                };
            case 'outline':
                return { variant: 'outline' as const, className: 'border-gray-200 hover:bg-gray-50 text-gray-700' };
            default:
                return { variant: 'default' as const, className: '' };
        }
    };

    const getSizeConfig = () => {
        switch (size) {
            case 'sm': return 'sm';
            case 'lg': return 'lg';
            default: return 'default';
        }
    };

    const { variant: shadcnVariant, className: variantClass } = getVariantConfig();
    const shadcnSize = getSizeConfig();

    return (
        <ShadcnButton
            variant={shadcnVariant}
            size={shadcnSize}
            className={cn(
                "font-semibold transition-all duration-200",
                size === 'md' && "h-11 px-4 text-base", // Custom size adjustment for 'md' to match previous design
                size === 'lg' && "h-12 px-6 text-lg",
                variantClass,
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="mr-2">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2">{rightIcon}</span>}
                </>
            )}
        </ShadcnButton>
    );
};
