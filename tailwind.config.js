import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                border: '#1F2937',
                input: '#1F2937',
                ring: '#2563EB',
                background: '#0F172A',
                foreground: '#F8FAFC',
                primary: {
                    DEFAULT: '#2563EB',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#1F2937',
                    foreground: '#F8FAFC',
                },
                destructive: {
                    DEFAULT: '#DC2626',
                    foreground: '#FFFFFF',
                },
                muted: {
                    DEFAULT: '#1F2937',
                    foreground: '#94A3B8',
                },
                accent: {
                    DEFAULT: '#1F2937',
                    foreground: '#F8FAFC',
                },
                card: {
                    DEFAULT: '#111827',
                    foreground: '#F8FAFC',
                },
                success: {
                    DEFAULT: '#16A34A',
                    foreground: '#FFFFFF',
                },
                warning: {
                    DEFAULT: '#D97706',
                    foreground: '#FFFFFF',
                },
                danger: {
                    DEFAULT: '#DC2626',
                    foreground: '#FFFFFF',
                },
            },
        },
    },

    plugins: [forms],
};
