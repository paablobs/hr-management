import { useAuth } from '../../contexts/AuthContext';
import { NAV_ITEMS } from '../../utils/navigation';
import { getInitials } from '../../utils/format';
import { Box, VStack, Text, HStack, Avatar, Button } from '@chakra-ui/react';

interface SidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ currentPath, onNavigate, collapsed }: SidebarProps) {
    const { user, logout } = useAuth();
    if (!user) return null;

    const navItems = NAV_ITEMS[user.role] || [];

    return (
        <Box
            as="nav"
            w={collapsed ? '72px' : '260px'}
            minH="100vh"
            bg="white"
            borderRight="1px solid"
            borderColor="border.default"
            display="flex"
            flexDirection="column"
            transition="width 0.2s ease"
            position="fixed"
            left={0}
            top={0}
            zIndex={20}
            overflow="hidden"
        >
            <Box p={collapsed ? 3 : 5} borderBottom="1px solid" borderColor="border.default">
                <HStack gap={3} overflow="hidden">
                    <Box
                        w="36px"
                        h="36px"
                        bg="brand.500"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                    >
                        <Text color="white" fontWeight="bold" fontSize="sm">
                            HR
                        </Text>
                    </Box>
                    {!collapsed && (
                        <Box overflow="hidden">
                            <Text fontWeight="700" fontSize="md" color="text.primary" whiteSpace="nowrap">
                                HR Platform
                            </Text>
                            <Text fontSize="xs" color="text.secondary" whiteSpace="nowrap">
                                Management Suite
                            </Text>
                        </Box>
                    )}
                </HStack>
            </Box>

            <VStack flex={1} p={collapsed ? 2 : 3} gap={1} align="stretch" overflowY="auto">
                {navItems.map((item) => {
                    const isActive =
                        currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
                    return (
                        <Button
                            key={item.path}
                            variant="ghost"
                            justifyContent={collapsed ? 'center' : 'flex-start'}
                            px={collapsed ? 0 : 3}
                            h="40px"
                            borderRadius="lg"
                            bg={isActive ? 'brand.50' : 'transparent'}
                            color={isActive ? 'brand.600' : 'text.secondary'}
                            fontWeight={isActive ? '600' : '500'}
                            fontSize="sm"
                            _hover={{ bg: isActive ? 'brand.50' : 'surface.tertiary' }}
                            onClick={() => onNavigate(item.path)}
                            title={collapsed ? item.label : undefined}
                            overflow="hidden"
                            whiteSpace="nowrap"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                {item.icon}
                            </span>
                            {!collapsed && <Text ml={2}>{item.label}</Text>}
                        </Button>
                    );
                })}
            </VStack>

            <Box p={collapsed ? 3 : 4} borderTop="1px solid" borderColor="border.default">
                <HStack gap={3} overflow="hidden">
                    <Avatar.Root size="sm" flexShrink={0}>
                        <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                    </Avatar.Root>
                    {!collapsed && (
                        <>
                            <Box flex={1} minW={0}>
                                <Text fontSize="sm" fontWeight="600" color="text.primary" truncate>
                                    {user.firstName} {user.lastName}
                                </Text>
                                <Text fontSize="xs" color="text.secondary" truncate>
                                    {user.email}
                                </Text>
                            </Box>
                            <Button
                                size="xs"
                                variant="ghost"
                                color="text.secondary"
                                onClick={logout}
                                title="Logout"
                                flexShrink={0}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                    logout
                                </span>
                            </Button>
                        </>
                    )}
                </HStack>
            </Box>
        </Box>
    );
}
