import { ChakraProvider as ChakraUIProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import type { ReactNode } from 'react';

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                brand: {
                    50: { value: '#eef2ff' },
                    100: { value: '#e0e7ff' },
                    200: { value: '#c7d2fe' },
                    300: { value: '#a5b4fc' },
                    400: { value: '#818cf8' },
                    500: { value: '#6366f1' },
                    600: { value: '#4f46e5' },
                    700: { value: '#4338ca' },
                    800: { value: '#3730a3' },
                    900: { value: '#312e81' },
                },
                surface: {
                    primary: { value: '#ffffff' },
                    secondary: { value: '#f8fafc' },
                    tertiary: { value: '#f1f5f9' },
                },
                text: {
                    primary: { value: '#1e293b' },
                    secondary: { value: '#64748b' },
                    muted: { value: '#94a3b8' },
                },
                border: {
                    default: { value: '#e2e8f0' },
                    muted: { value: '#f1f5f9' },
                },
                success: { value: '#10b981' },
                warning: { value: '#f59e0b' },
                error: { value: '#ef4444' },
                info: { value: '#3b82f6' },
            },
            fonts: {
                heading: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
                body: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
            },
        },
    },
    globalCss: {
        'html, body': {
            margin: '0',
            padding: '0',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: '#1e293b',
            backgroundColor: '#f8fafc',
            lineHeight: '1.6',
        },
        '*': {
            boxSizing: 'border-box',
        },
    },
});

const system = createSystem(defaultConfig, config);

export function ChakraProvider({ children }: { children: ReactNode }) {
    return <ChakraUIProvider value={system}>{children}</ChakraUIProvider>;
}
