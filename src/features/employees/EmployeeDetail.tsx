import { Box, Text, HStack, Badge, SimpleGrid, Button, VStack } from '@chakra-ui/react';
import { employees } from '../../data/employees';
import { salaryHistory } from '../../data/salaries';
import { vacationRequests } from '../../data/vacations';
import { employeeTimelines } from '../../data/timelines';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, formatCurrency, getInitials, getStatusColor } from '../../utils/format';

interface EmployeeDetailProps {
    employeeId: string;
    onBack: () => void;
}

export function EmployeeDetail({ employeeId, onBack }: EmployeeDetailProps) {
    const { hasPermission } = useAuth();
    const employee = employees.find((e) => e.id === employeeId);

    if (!employee) {
        return (
            <Box textAlign="center" py={20}>
                <Text fontSize="lg" fontWeight="700" color="text.primary">
                    Employee not found
                </Text>
                <Button mt={4} variant="outline" onClick={onBack}>
                    Go back
                </Button>
            </Box>
        );
    }

    const empSalaryHistory = salaryHistory.filter((s) => s.employeeId === employeeId);
    const empVacations = vacationRequests.filter((v) => v.employeeId === employeeId);
    const empTimeline = employeeTimelines.filter((e) => e.employeeId === employeeId).slice(0, 10);

    return (
        <Box>
            <Button variant="ghost" size="sm" mb={4} onClick={onBack} color="text.secondary">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_back
                </span>
                Back to employees
            </Button>

            <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" overflow="hidden" mb={6}>
                <Box h="120px" bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" />
                <Box p={6} mt="-48px">
                    <HStack gap={5} align="end">
                        <Box
                            w="96px"
                            h="96px"
                            borderRadius="2xl"
                            bg="white"
                            border="4px solid white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow="md"
                        >
                            <Text fontSize="2xl" fontWeight="800" color="brand.600">
                                {getInitials(employee.firstName, employee.lastName)}
                            </Text>
                        </Box>
                        <Box flex={1}>
                            <Text fontSize="2xl" fontWeight="800" color="text.primary">
                                {employee.firstName} {employee.lastName}
                            </Text>
                            <Text fontSize="sm" color="text.secondary">
                                {employee.position} · {employee.department}
                            </Text>
                        </Box>
                        <Badge
                            bg={`${getStatusColor(employee.employmentStatus)}.50`}
                            color={`${getStatusColor(employee.employmentStatus)}.600`}
                            borderRadius="md"
                            px={3}
                            py={1}
                            fontSize="sm"
                            textTransform="capitalize"
                        >
                            {employee.employmentStatus}
                        </Badge>
                    </HStack>
                </Box>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Personal Information
                    </Text>
                    <VStack gap={3} align="stretch">
                        {[
                            ['Email', employee.email],
                            ['Phone', employee.phone],
                            ['Date of Birth', formatDate(employee.dateOfBirth)],
                            ['Age', `${employee.age} years`],
                            ['National ID', employee.nationalId],
                            ['Address', employee.address],
                        ].map(([label, value]) => (
                            <HStack key={label} justify="space-between">
                                <Text fontSize="sm" color="text.secondary">
                                    {label}
                                </Text>
                                <Text fontSize="sm" fontWeight="500" color="text.primary">
                                    {value}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Employment Details
                    </Text>
                    <VStack gap={3} align="stretch">
                        {[
                            ['Department', employee.department],
                            ['Position', employee.position],
                            ['Start Date', formatDate(employee.employmentStartDate)],
                            [
                                'Tenure',
                                `${Math.floor((Date.now() - new Date(employee.employmentStartDate).getTime()) / (365.25 * 86400000))} years`,
                            ],
                            hasPermission('view_salaries') ? ['Salary', formatCurrency(employee.salary)] : null,
                        ]
                            .filter(Boolean)
                            .map(([label, value]) => (
                                <HStack key={label} justify="space-between">
                                    <Text fontSize="sm" color="text.secondary">
                                        {label}
                                    </Text>
                                    <Text fontSize="sm" fontWeight="500" color="text.primary">
                                        {value}
                                    </Text>
                                </HStack>
                            ))}
                    </VStack>
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Timeline
                    </Text>
                    <VStack gap={0} align="stretch">
                        {empTimeline.length === 0 ? (
                            <Text fontSize="sm" color="text.muted" textAlign="center" py={4}>
                                No events
                            </Text>
                        ) : (
                            empTimeline.map((event, idx) => (
                                <HStack key={event.id} gap={3} align="start" pb={4} position="relative">
                                    {idx < empTimeline.length - 1 && (
                                        <Box
                                            position="absolute"
                                            left="15px"
                                            top="28px"
                                            bottom={0}
                                            w="2px"
                                            bg="border.default"
                                        />
                                    )}
                                    <Box
                                        w="32px"
                                        h="32px"
                                        borderRadius="lg"
                                        bg={
                                            event.type === 'hired'
                                                ? 'green.50'
                                                : event.type === 'salary_change'
                                                  ? 'blue.50'
                                                  : event.type === 'vacation'
                                                    ? 'purple.50'
                                                    : 'gray.50'
                                        }
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                        position="relative"
                                        zIndex={1}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: '16px',
                                                color:
                                                    event.type === 'hired'
                                                        ? '#10b981'
                                                        : event.type === 'salary_change'
                                                          ? '#3b82f6'
                                                          : event.type === 'vacation'
                                                            ? '#8b5cf6'
                                                            : '#6b7280',
                                            }}
                                        >
                                            {event.type === 'hired'
                                                ? 'work'
                                                : event.type === 'salary_change'
                                                  ? 'payments'
                                                  : event.type === 'vacation'
                                                    ? 'calendar_month'
                                                    : 'circle'}
                                        </span>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="600" color="text.primary">
                                            {event.title}
                                        </Text>
                                        <Text fontSize="xs" color="text.secondary">
                                            {event.description}
                                        </Text>
                                        <Text fontSize="xs" color="text.muted" mt={0.5}>
                                            {formatDate(event.date)}
                                        </Text>
                                    </Box>
                                </HStack>
                            ))
                        )}
                    </VStack>
                </Box>
            </SimpleGrid>

            {hasPermission('view_salary_history') && empSalaryHistory.length > 0 && (
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6} mt={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Salary History
                    </Text>
                    <Box overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#64748b',
                                        }}
                                    >
                                        Date
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#64748b',
                                        }}
                                    >
                                        Previous
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#64748b',
                                        }}
                                    >
                                        New
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#64748b',
                                        }}
                                    >
                                        Change
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#64748b',
                                        }}
                                    >
                                        Reason
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {empSalaryHistory
                                    .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))
                                    .map((sh) => (
                                        <tr key={sh.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px 16px', fontSize: '14px' }}>
                                                {formatDate(sh.effectiveDate)}
                                            </td>
                                            <td style={{ padding: '10px 16px', fontSize: '14px' }}>
                                                {formatCurrency(sh.previousSalary)}
                                            </td>
                                            <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: '600' }}>
                                                {formatCurrency(sh.newSalary)}
                                            </td>
                                            <td style={{ padding: '10px 16px' }}>
                                                <Text
                                                    fontSize="sm"
                                                    color={sh.newSalary > sh.previousSalary ? 'green.600' : 'red.600'}
                                                    fontWeight="600"
                                                >
                                                    {sh.newSalary > sh.previousSalary ? '+' : ''}
                                                    {formatCurrency(sh.newSalary - sh.previousSalary)}
                                                </Text>
                                            </td>
                                            <td style={{ padding: '10px 16px', fontSize: '14px', color: '#64748b' }}>
                                                {sh.reason}
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
