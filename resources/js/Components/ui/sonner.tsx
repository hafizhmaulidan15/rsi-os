import { Toaster as SonnerToaster, toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export function Toaster() {
    const { flash } = usePage().props as unknown as {
        flash?: { success?: string; error?: string; warning?: string; info?: string };
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast.warning(flash.warning);
        if (flash?.info) toast.info(flash.info);
    }, [flash]);

    return (
        <SonnerToaster
            position="top-right"
            theme="dark"
            toastOptions={{
                style: {
                    background: '#111827',
                    border: '1px solid #1F2937',
                    color: '#fff',
                },
            }}
        />
    );
}
