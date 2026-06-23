import { Box, Text, HStack } from '@chakra-ui/react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    color?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatCard({ label, value, icon, color = 'brand.500', change, changeType = 'neutral' }: StatCardProps) {
    return (
        <Box
            bg="white"
            p={5}
            borderRadius="xl"
            border="1px solid"
            borderColor="border.default"
            _hover={{ boxShadow: 'sm' }}
            transition="box-shadow 0.2s"
        >
            <HStack justify="space-between" align="start">
                <Box>
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="text.secondary"
                        textTransform="uppercase"
                        letterSpacing="0.5px"
                    >
                        {label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="800" color="text.primary" mt={1}>
                        {value}
                    </Text>
                    {change && (
                        <Text
                            fontSize="xs"
                            color={
                                changeType === 'positive'
                                    ? 'success'
                                    : changeType === 'negative'
                                      ? 'error'
                                      : 'text.muted'
                            }
                            mt={1}
                        >
                            {change}
                        </Text>
                    )}
                </Box>
                <Box
                    w="44px"
                    h="44px"
                    borderRadius="xl"
                    bg={`${color}15`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ color: `var(--chakra-colors-${color.replace('.', '-')})`, fontSize: '22px' }}
                    >
                        {icon}
                    </span>
                </Box>
            </HStack>
        </Box>
    );
}
