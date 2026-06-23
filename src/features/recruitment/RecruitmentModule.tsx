import { useState, useMemo } from 'react';
import { Box, Text, HStack, Badge, Button, SimpleGrid } from '@chakra-ui/react';
import { candidates as initialCandidates } from '../../data/candidates';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, getStatusColor, getInitials } from '../../utils/format';
import { CANDIDATE_STATUS_LABELS, type CandidateStatus, type Candidate } from '../../types';

interface RecruitmentModuleProps {
    onNavigate: (path: string) => void;
}

export function RecruitmentModule({ onNavigate }: RecruitmentModuleProps) {
    const { hasPermission } = useAuth();
    if (!hasPermission('access_candidates')) {
        return (
            <Box textAlign="center" py={20}>
                <Text fontSize="lg" fontWeight="700">
                    Access Denied
                </Text>
                <Text fontSize="sm" color="text.secondary">
                    You don't have permission to access recruitment
                </Text>
            </Box>
        );
    }

    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        let result = [...candidates];
        if (statusFilter) result = result.filter((c) => c.status === statusFilter);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.firstName.toLowerCase().includes(q) ||
                    c.lastName.toLowerCase().includes(q) ||
                    c.desiredPosition.toLowerCase().includes(q),
            );
        }
        return result.sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));
    }, [candidates, statusFilter, search]);

    const activeCount = candidates.filter((c) => !['hired', 'rejected'].includes(c.status)).length;
    const hiredCount = candidates.filter((c) => c.status === 'hired').length;
    const interviewCount = candidates.filter((c) => ['interview', 'technical_interview'].includes(c.status)).length;

    const handleStatusChange = (id: string, newStatus: CandidateStatus) => {
        setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    };

    const statusOptions: CandidateStatus[] = [
        'new',
        'screening',
        'interview',
        'technical_interview',
        'offer',
        'hired',
        'rejected',
    ];

    return (
        <Box>
            <PageHeader
                title="Recruitment"
                subtitle={`${candidates.length} total candidates`}
                action={{
                    label: 'Pipeline View',
                    onClick: () => onNavigate('/recruitment/pipeline'),
                    icon: 'view_kanban',
                }}
            />

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={8}>
                <StatCard label="Active Candidates" value={activeCount} icon="person_search" color="brand.500" />
                <StatCard label="In Interview" value={interviewCount} icon="groups" color="purple.500" />
                <StatCard label="Hired" value={hiredCount} icon="check_circle" color="green.500" />
            </SimpleGrid>

            <HStack gap={3} mb={4} flexWrap="wrap">
                <input
                    type="text"
                    placeholder="Search candidates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        minWidth: '250px',
                    }}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        background: 'white',
                        minWidth: '160px',
                    }}
                >
                    <option value="">All Statuses</option>
                    {statusOptions.map((s) => (
                        <option key={s} value={s}>
                            {CANDIDATE_STATUS_LABELS[s]}
                        </option>
                    ))}
                </select>
            </HStack>

            {filtered.length === 0 ? (
                <EmptyState icon="person_search" title="No candidates found" description="Try adjusting your filters" />
            ) : (
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" overflow="hidden">
                    <Box overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    {[
                                        'Candidate',
                                        'Position',
                                        'Experience',
                                        'Skills',
                                        'Applied',
                                        'Status',
                                        'Actions',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                textAlign: 'left',
                                                padding: '12px 16px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#64748b',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((cand) => (
                                    <tr key={cand.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <HStack gap={3}>
                                                <Box
                                                    w="36px"
                                                    h="36px"
                                                    borderRadius="lg"
                                                    bg="purple.50"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Text fontSize="xs" fontWeight="700" color="purple.600">
                                                        {getInitials(cand.firstName, cand.lastName)}
                                                    </Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="600">
                                                        {cand.firstName} {cand.lastName}
                                                    </Text>
                                                    <Text fontSize="xs" color="text.secondary">
                                                        {cand.email}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm">{cand.desiredPosition}</Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm">{cand.yearsOfExperience} yrs</Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <HStack gap={1} flexWrap="wrap">
                                                {cand.skills.slice(0, 3).map((s) => (
                                                    <Badge
                                                        key={s}
                                                        bg="surface.tertiary"
                                                        color="text.secondary"
                                                        borderRadius="md"
                                                        px={1.5}
                                                        fontSize="10px"
                                                    >
                                                        {s}
                                                    </Badge>
                                                ))}
                                                {cand.skills.length > 3 && (
                                                    <Badge
                                                        bg="surface.tertiary"
                                                        color="text.muted"
                                                        borderRadius="md"
                                                        px={1.5}
                                                        fontSize="10px"
                                                    >
                                                        +{cand.skills.length - 3}
                                                    </Badge>
                                                )}
                                            </HStack>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" color="text.secondary">
                                                {formatDate(cand.applicationDate)}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <select
                                                value={cand.status}
                                                onChange={(e) =>
                                                    handleStatusChange(cand.id, e.target.value as CandidateStatus)
                                                }
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '12px',
                                                    background: 'white',
                                                }}
                                            >
                                                {statusOptions.map((s) => (
                                                    <option key={s} value={s}>
                                                        {CANDIDATE_STATUS_LABELS[s]}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Button size="xs" variant="ghost" color="text.secondary">
                                                <span
                                                    className="material-symbols-outlined"
                                                    style={{ fontSize: '18px' }}
                                                >
                                                    visibility
                                                </span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
