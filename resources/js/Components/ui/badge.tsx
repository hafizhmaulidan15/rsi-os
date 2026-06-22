import * as React from 'react';
import { cn } from '@/Utils/cn';

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'success' | 'warning' | 'danger' }>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-primary/10 text-primary border-primary/20',
            success: 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20',
            warning: 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20',
            danger: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20',
        };
        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                    variants[variant],
                    className,
                )}
                {...props}
            />
        );
    },
);
Badge.displayName = 'Badge';

export { Badge };
