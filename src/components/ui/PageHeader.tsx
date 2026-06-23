import { Box, Text, Button, VStack, HStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: { label: string; onClick: () => void; icon?: string };
    children?: ReactNode;
}

export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
    return (
        <HStack justify="space-between" mb={6} align="start" flexWrap="wrap" gap={4}>
            <Box>
                <Text fontSize="2xl" fontWeight="800" color="text.primary">
                    {title}
                </Text>
                {subtitle && (
                    <Text fontSize="sm" color="text.secondary" mt={1}>
                        {subtitle}
                    </Text>
                )}
            </Box>
            <HStack gap={3}>
                {children}
                {action && (
                    <Button
                        bg="brand.500"
                        color="white"
                        _hover={{ bg: 'brand.600' }}
                        size="sm"
                        borderRadius="lg"
                        fontWeight="600"
                        onClick={action.onClick}
                    >
                        {action.icon && (
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                {action.icon}
                            </span>
                        )}
                        {action.label}
                    </Button>
                )}
            </HStack>
        </HStack>
    );
}
