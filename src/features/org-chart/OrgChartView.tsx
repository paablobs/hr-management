import { Box, Text, HStack, Badge } from '@chakra-ui/react';
import { orgChart } from '../../data/org-chart';
import { PageHeader } from '../../components/ui/PageHeader';
import { getInitials } from '../../utils/format';
import type { OrgNode } from '../../types';

function OrgNodeCard({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="border.default"
                p={4}
                minW="180px"
                textAlign="center"
                _hover={{ boxShadow: 'md', borderColor: 'brand.300' }}
                transition="all 0.2s"
            >
                <Box
                    w="48px"
                    h="48px"
                    borderRadius="xl"
                    bg="brand.50"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                >
                    <Text fontSize="sm" fontWeight="800" color="brand.600">
                        {getInitials(node.name.split(' ')[0], node.name.split(' ')[1] || '')}
                    </Text>
                </Box>
                <Text fontSize="sm" fontWeight="700" color="text.primary">
                    {node.name}
                </Text>
                <Text fontSize="xs" color="text.secondary" mt={0.5}>
                    {node.position}
                </Text>
                <Badge bg="surface.tertiary" color="text.secondary" borderRadius="md" px={2} fontSize="10px" mt={1}>
                    {node.department}
                </Badge>
            </Box>

            {node.children.length > 0 && (
                <Box position="relative">
                    <Box w="2px" h="20px" bg="border.default" mx="auto" />
                    <Box display="flex" gap={3} position="relative">
                        {node.children.length > 1 && (
                            <Box position="absolute" top={0} left="10%" right="10%" h="2px" bg="border.default" />
                        )}
                        {node.children.map((child) => (
                            <Box key={child.id} display="flex" flexDirection="column" alignItems="center">
                                <Box w="2px" h="16px" bg="border.default" />
                                <OrgNodeCard node={child} depth={depth + 1} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export function OrgChartView() {
    return (
        <Box>
            <PageHeader title="Organization Chart" subtitle="Company hierarchy" />
            <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={8} overflowX="auto">
                <Box display="flex" justifyContent="center" minW="fit-content">
                    <OrgNodeCard node={orgChart} />
                </Box>
            </Box>
        </Box>
    );
}
