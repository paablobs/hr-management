import { useState } from 'react';
import { Box, HStack, Text, Button, Avatar, Badge, VStack } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS, type Notification } from '../../types';
import { notifications as allNotifications } from '../../data/notifications';
import { getRelativeTime } from '../../utils/format';

interface TopBarProps {
    title: string;
    collapsed: boolean;
    onToggleSidebar: () => void;
}

export function TopBar({ title, collapsed, onToggleSidebar }: TopBarProps) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    if (!user) return null;

    const userNotifications = allNotifications.filter((n) => n.userId === user.id);
    const unreadCount = userNotifications.filter((n) => !n.read).length;

    return (
        <Box
            as="header"
            h="64px"
            bg="white"
            borderBottom="1px solid"
            borderColor="border.default"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={6}
            position="sticky"
            top={0}
            zIndex={15}
        >
            <HStack gap={4}>
                <Button variant="ghost" size="sm" onClick={onToggleSidebar} color="text.secondary">
                    <span className="material-symbols-outlined">{collapsed ? 'menu' : 'menu_open'}</span>
                </Button>
                <Box>
                    <Text fontSize="lg" fontWeight="700" color="text.primary">
                        {title}
                    </Text>
                </Box>
            </HStack>

            <HStack gap={3}>
                <Box position="relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        color="text.secondary"
                        onClick={() => setShowNotifications(!showNotifications)}
                        position="relative"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                            notifications
                        </span>
                        {unreadCount > 0 && (
                            <Badge
                                position="absolute"
                                top="-2px"
                                right="-2px"
                                bg="error"
                                color="white"
                                borderRadius="full"
                                minW="18px"
                                h="18px"
                                fontSize="10px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </Button>

                    {showNotifications && (
                        <>
                            <Box position="fixed" inset={0} onClick={() => setShowNotifications(false)} />
                            <Box
                                position="absolute"
                                top="100%"
                                right={0}
                                mt={2}
                                w="380px"
                                maxH="480px"
                                bg="white"
                                borderRadius="xl"
                                boxShadow="0 20px 60px rgba(0,0,0,0.15)"
                                border="1px solid"
                                borderColor="border.default"
                                overflow="hidden"
                                zIndex={100}
                            >
                                <Box p={4} borderBottom="1px solid" borderColor="border.default">
                                    <Text fontWeight="700" fontSize="md">
                                        Notifications
                                    </Text>
                                    <Text fontSize="xs" color="text.secondary">
                                        {unreadCount} unread
                                    </Text>
                                </Box>
                                <Box maxH="400px" overflowY="auto">
                                    {userNotifications.length === 0 ? (
                                        <Box p={8} textAlign="center">
                                            <Text color="text.muted" fontSize="sm">
                                                No notifications
                                            </Text>
                                        </Box>
                                    ) : (
                                        userNotifications.slice(0, 10).map((notif) => (
                                            <Box
                                                key={notif.id}
                                                p={3}
                                                borderBottom="1px solid"
                                                borderColor="border.muted"
                                                bg={notif.read ? 'transparent' : 'brand.50'}
                                                cursor="pointer"
                                                _hover={{ bg: 'surface.tertiary' }}
                                            >
                                                <HStack gap={3} align="start">
                                                    <Box
                                                        w="8px"
                                                        h="8px"
                                                        borderRadius="full"
                                                        bg={notif.read ? 'transparent' : 'brand.500'}
                                                        mt={2}
                                                        flexShrink={0}
                                                    />
                                                    <Box minW={0}>
                                                        <Text fontSize="sm" fontWeight="600" color="text.primary">
                                                            {notif.title}
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="text.secondary"
                                                            mt={0.5}
                                                            lineClamp={2}
                                                        >
                                                            {notif.message}
                                                        </Text>
                                                        <Text fontSize="xs" color="text.muted" mt={1}>
                                                            {getRelativeTime(notif.createdAt)}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        ))
                                    )}
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>

                <HStack gap={2} pl={2} borderLeft="1px solid" borderColor="border.default">
                    <Avatar.Root size="sm">
                        <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                    </Avatar.Root>
                    <Box display={{ base: 'none', md: 'block' }}>
                        <Text fontSize="sm" fontWeight="600" color="text.primary">
                            {user.firstName} {user.lastName}
                        </Text>
                        <Text fontSize="xs" color="text.secondary">
                            {ROLE_LABELS[user.role]}
                        </Text>
                    </Box>
                </HStack>
            </HStack>
        </Box>
    );
}
