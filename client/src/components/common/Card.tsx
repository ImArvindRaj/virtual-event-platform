import React from 'react';
import {
    Card as ShadcnCard,
    CardHeader as ShadcnCardHeader,
    CardContent as ShadcnCardContent,
    CardFooter as ShadcnCardFooter
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'gradient' | 'outline' | 'interactive';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    onClick,
    ...props
}) => {
    const variants = {
        default: 'bg-white border-gray-100 shadow-sm hover:shadow-md',
        glass: 'glass-panel border-white/20 bg-white/60 backdrop-blur-xl',
        gradient: 'bg-gradient-to-br from-indigo-50/50 to-violet-50/50 border-indigo-100/50',
        outline: 'bg-transparent border-2 border-gray-200',
        interactive: 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300'
    };



    return (
        <ShadcnCard
            className={cn(
                "transition-all duration-200 overflow-hidden",
                variants[variant],
                // If padding is handled by CardContent, we might not need it here, 
                // but for a wrapper component it's often useful to have a default.
                // However, shadcn Card usually expects content in CardContent.
                // We will apply padding to the wrapper if strictly needed, but usually it's better on children.
                // Let's keep it flexible.
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </ShadcnCard>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <ShadcnCardHeader className={cn("p-6 pb-3", className)} {...props}>
            {children}
        </ShadcnCardHeader>
    );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <ShadcnCardContent className={cn("p-6 pt-3", className)} {...props}>
            {children}
        </ShadcnCardContent>
    );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <ShadcnCardFooter className={cn("p-6 pt-0 flex items-center", className)} {...props}>
            {children}
        </ShadcnCardFooter>
    );
};
