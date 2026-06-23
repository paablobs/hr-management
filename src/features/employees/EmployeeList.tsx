import { useState, useMemo } from 'react';
import { Box, Text, Input, HStack, Badge, SimpleGrid, Select, Button } from '@chakra-ui/react';
import { employees } from '../../data/employees';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, formatCurrency, getInitials, getStatusColor } from '../../utils/format';
import { DEPARTMENTS } from '../../types';

interface EmployeeListProps {
    onNavigate: (path: string) => void;
}

export function EmployeeList({ onNavigate }: EmployeeListProps) {
    const { hasPermission } = useAuth();
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'department' | 'startDate'>('name');

    const filtered = useMemo(() => {
        let result = employees.filter((e) => e.employmentStatus === 'active');

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.firstName.toLowerCase().includes(q) ||
                    e.lastName.toLowerCase().includes(q) ||
                    e.position.toLowerCase().includes(q) ||
                    e.email.toLowerCase().includes(q),
            );
        }

        if (department) {
            result = result.filter((e) => e.department === department);
        }

        if (status) {
            result = result.filter((e) => e.employmentStatus === status);
        }

        result.sort((a, b) => {
            if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            if (sortBy === 'department') return a.department.localeCompare(b.department);
            return a.employmentStartDate.localeCompare(b.employmentStartDate);
        });

        return result;
    }, [search, department, status, sortBy]);

    return (
        <Box>
            <PageHeader title="Employees" subtitle={`${filtered.length} employees found`} />

            <HStack gap={3} mb={6} flexWrap="wrap">
                <Input
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    maxW="300px"
                    size="sm"
                    borderRadius="lg"
                    bg="white"
                />
                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        background: 'white',
                        minWidth: '160px',
                    }}
                >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        background: 'white',
                        minWidth: '140px',
                    }}
                >
                    <option value="name">Sort by Name</option>
                    <option value="department">Sort by Department</option>
                    <option value="startDate">Sort by Start Date</option>
                </select>
            </HStack>

            {filtered.length === 0 ? (
                <EmptyState
                    icon="people"
                    title="No employees found"
                    description="Try adjusting your search or filters"
                />
            ) : (
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" overflow="hidden">
                    <Box overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <th
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
                                        Employee
                                    </th>
                                    <th
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
                                        Department
                                    </th>
                                    <th
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
                                        Position
                                    </th>
                                    {hasPermission('view_salaries') && (
                                        <th
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
                                            Salary
                                        </th>
                                    )}
                                    <th
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
                                        Start Date
                                    </th>
                                    <th
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
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                        onClick={() => onNavigate(`/employees/${emp.id}`)}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                                    >
                                        <td style={{ padding: '12px 16px' }}>
                                            <HStack gap={3}>
                                                <Box
                                                    w="36px"
                                                    h="36px"
                                                    borderRadius="lg"
                                                    bg="brand.50"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexShrink={0}
                                                >
                                                    <Text fontSize="xs" fontWeight="700" color="brand.600">
                                                        {getInitials(emp.firstName, emp.lastName)}
                                                    </Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="600" color="text.primary">
                                                        {emp.firstName} {emp.lastName}
                                                    </Text>
                                                    <Text fontSize="xs" color="text.secondary">
                                                        {emp.email}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Badge
                                                bg="surface.tertiary"
                                                color="text.secondary"
                                                borderRadius="md"
                                                px={2}
                                                fontSize="xs"
                                            >
                                                {emp.department}
                                            </Badge>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" color="text.primary">
                                                {emp.position}
                                            </Text>
                                        </td>
                                        {hasPermission('view_salaries') && (
                                            <td style={{ padding: '12px 16px' }}>
                                                <Text fontSize="sm" fontWeight="600" color="text.primary">
                                                    {formatCurrency(emp.salary)}
                                                </Text>
                                            </td>
                                        )}
                                        <td style={{ padding: '12px 16px' }}>
                                            <Text fontSize="sm" color="text.secondary">
                                                {formatDate(emp.employmentStartDate)}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Badge
                                                bg={`${getStatusColor(emp.employmentStatus)}.50`}
                                                color={`${getStatusColor(emp.employmentStatus)}.600`}
                                                borderRadius="md"
                                                px={2}
                                                fontSize="xs"
                                                textTransform="capitalize"
                                            >
                                                {emp.employmentStatus}
                                            </Badge>
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
