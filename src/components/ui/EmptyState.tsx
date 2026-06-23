import { Box, Text } from '@chakra-ui/react';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <Box textAlign="center" py={16} px={4}>
            <Box
                w="64px"
                h="64px"
                borderRadius="2xl"
                bg="surface.tertiary"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#94a3b8' }}>
                    {icon}
                </span>
            </Box>
            <Text fontSize="lg" fontWeight="700" color="text.primary">
                {title}
            </Text>
            <Text fontSize="sm" color="text.secondary" mt={1} maxW="400px" mx="auto">
                {description}
            </Text>
            {action && (
                <Box
                    as="button"
                    mt={4}
                    px={4}
                    py={2}
                    bg="brand.500"
                    color="white"
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="600"
                    cursor="pointer"
                    _hover={{ bg: 'brand.600' }}
                    onClick={action.onClick}
                >
                    {action.label}
                </Box>
            )}
        </Box>
    );
}
