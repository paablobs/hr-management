import { useState, useMemo } from 'react';
import { Box, Text, HStack, Badge, Button, SimpleGrid } from '@chakra-ui/react';
import { payrollEntries as initialPayroll } from '../../data/payroll';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/format';
import type { PayrollEntry, PayrollStatus } from '../../types';

export function AccountingModule() {
    const { hasPermission } = useAuth();
    if (!hasPermission('access_accounting')) {
        return (
            <Box textAlign="center" py={20}>
                <Text fontSize="lg" fontWeight="700">
                    Access Denied
                </Text>
                <Text fontSize="sm" color="text.secondary">
                    You don't have permission to access accounting
                </Text>
            </Box>
        );
    }

    const [payroll, setPayroll] = useState<PayrollEntry[]>(initialPayroll);
    const [monthFilter, setMonthFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const months = [...new Set(payroll.map((p) => p.month))].sort().reverse();

    const filtered = useMemo(() => {
        let result = [...payroll];
        if (monthFilter) result = result.filter((p) => p.month === monthFilter);
        if (statusFilter) result = result.filter((p) => p.paymentStatus === statusFilter);
        return result;
    }, [payroll, monthFilter, statusFilter]);

    const paidCount = payroll.filter((p) => p.paymentStatus === 'paid').length;
    const pendingCount = payroll.filter((p) => p.paymentStatus === 'pending').length;
    const failedCount = payroll.filter((p) => p.paymentStatus === 'failed').length;
    const totalPaid = payroll.filter((p) => p.paymentStatus === 'paid').reduce((s, p) => s + p.salaryAmount, 0);

    const handleToggleStatus = (id: string) => {
        setPayroll((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const newStatus: PayrollStatus = p.paymentStatus === 'paid' ? 'pending' : 'paid';
                return {
                    ...p,
                    paymentStatus: newStatus,
                    paymentDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null,
                };
            }),
        );
    };

    return (
        <Box>
            <PageHeader title="Accounting" subtitle="Payroll management and tracking" />

            <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} mb={8}>
                <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon="check_circle" color="green.500" />
                <StatCard label="Paid Entries" value={paidCount} icon="receipt_long" color="blue.500" />
                <StatCard label="Pending" value={pendingCount} icon="schedule" color="orange.500" />
                <StatCard label="Failed" value={failedCount} icon="error" color="red.500" />
            </SimpleGrid>

            <HStack gap={3} mb={4} flexWrap="wrap">
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        background: 'white',
                        minWidth: '140px',
                    }}
                >
                    <option value="">All Months</option>
                    {months.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
                {['', 'paid', 'pending', 'failed'].map((s) => (
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

            <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" overflow="hidden">
                <Box overflowX="auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                {['Employee', 'Department', 'Month', 'Amount', 'Status', 'Payment Date', 'Actions'].map(
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
                            {filtered.slice(0, 50).map((entry) => (
                                <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Text fontSize="sm" fontWeight="600">
                                            {entry.employeeName}
                                        </Text>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Badge
                                            bg="surface.tertiary"
                                            color="text.secondary"
                                            borderRadius="md"
                                            px={2}
                                            fontSize="xs"
                                        >
                                            {entry.department}
                                        </Badge>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Text fontSize="sm">{entry.month}</Text>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Text fontSize="sm" fontWeight="600">
                                            {formatCurrency(entry.salaryAmount)}
                                        </Text>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Badge
                                            bg={`${getStatusColor(entry.paymentStatus)}.50`}
                                            color={`${getStatusColor(entry.paymentStatus)}.600`}
                                            borderRadius="md"
                                            px={2}
                                            fontSize="xs"
                                            textTransform="capitalize"
                                        >
                                            {entry.paymentStatus}
                                        </Badge>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Text fontSize="sm" color="text.secondary">
                                            {entry.paymentDate ? formatDate(entry.paymentDate) : '-'}
                                        </Text>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            onClick={() => handleToggleStatus(entry.id)}
                                        >
                                            Mark {entry.paymentStatus === 'paid' ? 'Pending' : 'Paid'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    );
}
