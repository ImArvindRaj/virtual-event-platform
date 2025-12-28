import toast from 'react-hot-toast';

// Custom toast styles matching our design system
const toastStyles = {
    success: {
        style: {
            background: 'hsl(142, 76%, 48%)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
            primary: 'white',
            secondary: 'hsl(142, 76%, 48%)',
        },
    },
    error: {
        style: {
            background: 'hsl(0, 84%, 60%)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
            primary: 'white',
            secondary: 'hsl(0, 84%, 60%)',
        },
    },
    loading: {
        style: {
            background: 'hsl(220, 18%, 12%)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
            primary: 'white',
            secondary: 'hsl(220, 18%, 12%)',
        },
    },
    custom: {
        style: {
            background: 'white',
            color: 'hsl(220, 18%, 12%)',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            border: '1px solid hsl(220, 16%, 90%)',
        },
    },
};

// Toast notification utilities
export const showToast = {
    success: (message: string, options = {}) => {
        return toast.success(message, {
            duration: 4000,
            position: 'top-right',
            ...toastStyles.success,
            ...options,
        });
    },

    error: (message: string, options = {}) => {
        return toast.error(message, {
            duration: 5000,
            position: 'top-right',
            ...toastStyles.error,
            ...options,
        });
    },

    loading: (message: string, options = {}) => {
        return toast.loading(message, {
            position: 'top-right',
            ...toastStyles.loading,
            ...options,
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        },
        options = {}
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                position: 'top-right',
                success: toastStyles.success,
                error: toastStyles.error,
                loading: toastStyles.loading,
                ...options,
            }
        );
    },

    custom: (message: string, options = {}) => {
        return toast(message, {
            duration: 4000,
            position: 'top-right',
            ...toastStyles.custom,
            ...options,
        });
    },

    dismiss: (toastId?: string) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },

    // Convenience method for API errors
    apiError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'An error occurred';
        return toast.error(message, {
            duration: 5000,
            position: 'top-right',
            ...toastStyles.error,
        });
    },
};

// Default export for direct toast usage
export default showToast;
