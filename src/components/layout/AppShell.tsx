import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
    children: React.ReactNode;
    title: string;
    currentPath: string;
    onNavigate: (path: string) => void;
}

export function AppShell({ children, title, currentPath, onNavigate }: AppShellProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Box display="flex" minH="100vh" bg="surface.secondary">
            <Sidebar
                currentPath={currentPath}
                onNavigate={onNavigate}
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
            />
            <Box flex={1} ml={collapsed ? '72px' : '260px'} transition="margin-left 0.2s ease">
                <TopBar title={title} collapsed={collapsed} onToggleSidebar={() => setCollapsed(!collapsed)} />
                <Box as="main" p={6}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
