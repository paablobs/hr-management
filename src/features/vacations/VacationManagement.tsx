import { useState, useMemo } from 'react';
import { Box, Text, HStack, Badge, Button, SimpleGrid } from '@chakra-ui/react';
import { vacationRequests as initialVacations } from '../../data/vacations';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, getStatusColor } from '../../utils/format';
import type { VacationRequest, VacationStatus } from '../../types';

export function VacationManagement() {
    const { user, hasPermission } = useAuth();
    const [vacations, setVacations] = useState<VacationRequest[]>(initialVacations);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const filtered = useMemo(() => {
        let result = [...vacations];
        if (statusFilter) result = result.filter((v) => v.status === statusFilter);
        return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }, [vacations, statusFilter]);

    const pending = vacations.filter((v) => v.status === 'pending').length;
    const approved = vacations.filter((v) => v.status === 'approved').length;
    const rejected = vacations.filter((v) => v.status === 'rejected').length;

    const handleApprove = (id: string) => {
        setVacations((prev) =>
            prev.map((v) =>
                v.id === id
                    ? {
                          ...v,
                          status: 'approved' as VacationStatus,
                          reviewedBy: `${user?.firstName} ${user?.lastName}`,
                          reviewedAt: new Date().toISOString(),
                      }
                    : v,
            ),
        );
    };

    const handleReject = (id: string) => {
        setVacations((prev) =>
            prev.map((v) =>
                v.id === id
                    ? {
                          ...v,
                          status: 'rejected' as VacationStatus,
                          reviewedBy: `${user?.firstName} ${user?.lastName}`,
                          reviewedAt: new Date().toISOString(),
                      }
                    : v,
            ),
        );
    };

    return (
        <Box>
            <PageHeader title="Vacation Management" subtitle={`${vacations.length} total requests`} />

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
                <StatCard label="Pending" value={pending} icon="schedule" color="orange.500" />
                <StatCard label="Approved" value={approved} icon="check_circle" color="green.500" />
                <StatCard label="Rejected" value={rejected} icon="cancel" color="red.500" />
            </SimpleGrid>

            <HStack gap={3} mb={4}>
                {['', 'pending', 'approved', 'rejected'].map((s) => (
                    <Button
                        key={s}
                        size="sm"
                        variant={statusFilter === s ? 'solid' : 'outline'}
                        bg={statusFilter === s ? 'brand.500' : 'white'}
                        color={statusFilter === s ? 'white' : 'text.secondary'}
                        borderRadius="lg"
                        onClick={() => setStatusFilter(s)}
                    >
                        {s || 'All'}
                    </Button>
                ))}
            </HStack>

            {filtered.length === 0 ? (
                <EmptyState
                    icon="calendar_month"
                    title="No vacation requests"
                    description="No requests match your filter"
                />
            ) : (
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" overflow="hidden">
                    <Box overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    {['Employee', 'Dates', 'Days', 'Reason', 'Status', 'Reviewed By', 'Actions'].map(
                                        (h) => (
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
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((vac) => (
                                    <tr key={vac.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" fontWeight="600" color="text.primary">
                                                {vac.employeeName}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" color="text.secondary">
                                                {formatDate(vac.startDate)} - {formatDate(vac.endDate)}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" fontWeight="600">
                                                {vac.totalDays}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" color="text.secondary" maxW="200px" truncate>
                                                {vac.reason}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Badge
                                                bg={`${getStatusColor(vac.status)}.50`}
                                                color={`${getStatusColor(vac.status)}.600`}
                                                borderRadius="md"
                                                px={2}
                                                fontSize="xs"
                                                textTransform="capitalize"
                                            >
                                                {vac.status}
                                            </Badge>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" color="text.secondary">
                                                {vac.reviewedBy || '-'}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {vac.status === 'pending' && hasPermission('approve_vacations') && (
                                                <HStack gap={2}>
                                                    <Button
                                                        size="xs"
                                                        bg="green.500"
                                                        color="white"
                                                        _hover={{ bg: 'green.600' }}
                                                        onClick={() => handleApprove(vac.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="xs"
                                                        bg="red.500"
                                                        color="white"
                                                        _hover={{ bg: 'red.600' }}
                                                        onClick={() => handleReject(vac.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </HStack>
                                            )}
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
