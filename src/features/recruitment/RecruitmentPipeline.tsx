import { useState, useMemo } from 'react';
import { Box, Text, HStack, Badge, Button } from '@chakra-ui/react';
import { candidates as initialCandidates } from '../../data/candidates';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { CANDIDATE_STATUS_LABELS, type CandidateStatus, type Candidate } from '../../types';
import { getInitials } from '../../utils/format';

const PIPELINE_COLUMNS: CandidateStatus[] = [
    'new',
    'screening',
    'interview',
    'technical_interview',
    'offer',
    'hired',
    'rejected',
];

export function RecruitmentPipeline() {
    const { hasPermission } = useAuth();
    if (!hasPermission('access_candidates')) {
        return (
            <Box textAlign="center" py={20}>
                <Text fontSize="lg" fontWeight="700">
                    Access Denied
                </Text>
            </Box>
        );
    }

    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (id: string) => setDraggedId(id);

    const handleDrop = (status: CandidateStatus) => {
        if (!draggedId) return;
        setCandidates((prev) => prev.map((c) => (c.id === draggedId ? { ...c, status } : c)));
        setDraggedId(null);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    return (
        <Box>
            <PageHeader title="Recruitment Pipeline" subtitle="Drag candidates between stages" />

            <Box overflowX="auto" pb={4}>
                <HStack gap={4} align="start" minW="1400px">
                    {PIPELINE_COLUMNS.map((status) => {
                        const columnCandidates = candidates.filter((c) => c.status === status);
                        return (
                            <Box
                                key={status}
                                flex={1}
                                minW="200px"
                                bg="surface.secondary"
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="border.default"
                                overflow="hidden"
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(status)}
                            >
                                <Box p={3} borderBottom="1px solid" borderColor="border.default" bg="white">
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" fontWeight="700" color="text.primary">
                                            {CANDIDATE_STATUS_LABELS[status]}
                                        </Text>
                                        <Badge bg="brand.50" color="brand.600" borderRadius="full" px={2} fontSize="xs">
                                            {columnCandidates.length}
                                        </Badge>
                                    </HStack>
                                </Box>
                                <Box p={2} minH="400px">
                                    {columnCandidates.map((cand) => (
                                        <Box
                                            key={cand.id}
                                            bg="white"
                                            p={3}
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor="border.default"
                                            mb={2}
                                            cursor="grab"
                                            draggable
                                            onDragStart={() => handleDragStart(cand.id)}
                                            _hover={{ boxShadow: 'md', borderColor: 'brand.300' }}
                                            transition="all 0.2s"
                                        >
                                            <HStack gap={2} mb={2}>
                                                <Box
                                                    w="28px"
                                                    h="28px"
                                                    borderRadius="md"
                                                    bg="purple.50"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Text fontSize="10px" fontWeight="700" color="purple.600">
                                                        {getInitials(cand.firstName, cand.lastName)}
                                                    </Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="600" color="text.primary">
                                                        {cand.firstName} {cand.lastName}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                            <Text fontSize="xs" color="text.secondary" mb={2}>
                                                {cand.desiredPosition}
                                            </Text>
                                            <HStack gap={1} flexWrap="wrap">
                                                {cand.skills.slice(0, 2).map((s) => (
                                                    <Badge
                                                        key={s}
                                                        bg="surface.tertiary"
                                                        color="text.secondary"
                                                        borderRadius="md"
                                                        px={1.5}
                                                        fontSize="9px"
                                                    >
                                                        {s}
                                                    </Badge>
                                                ))}
                                            </HStack>
                                        </Box>
                                    ))}
                                    {columnCandidates.length === 0 && (
                                        <Box textAlign="center" py={8}>
                                            <Text fontSize="xs" color="text.muted">
                                                No candidates
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </HStack>
            </Box>
        </Box>
    );
}
