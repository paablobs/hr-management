import { Box, Text, SimpleGrid, HStack, VStack, Badge } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { employees } from '../../data/employees';
import { vacationRequests } from '../../data/vacations';
import { payrollEntries } from '../../data/payroll';
import { candidates } from '../../data/candidates';
import { activities } from '../../data/activities';
import { StatCard } from '../../components/ui/StatCard';
import { formatCurrency, formatDate, getRelativeTime } from '../../utils/format';

export function Dashboard() {
    const { user, hasPermission } = useAuth();
    if (!user) return null;

    const activeEmployees = employees.filter((e) => e.employmentStatus === 'active').length;
    const pendingVacations = vacationRequests.filter((v) => v.status === 'pending').length;
    const pendingPayroll = payrollEntries.filter((p) => p.paymentStatus === 'pending').length;
    const activeCandidates = candidates.filter((c) => !['hired', 'rejected'].includes(c.status)).length;
    const recentActivities = activities.slice(0, 8);

    const upcomingBirthdays = employees
        .filter((e) => {
            const dob = new Date(e.dateOfBirth);
            const now = new Date();
            const thisYear = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
            const diff = thisYear.getTime() - now.getTime();
            return diff > 0 && diff < 30 * 86400000;
        })
        .slice(0, 5);

    const approvedVacations = vacationRequests.filter((v) => v.status === 'approved').length;
    const totalVacations = vacationRequests.length;
    const approvalRate = totalVacations > 0 ? Math.round((approvedVacations / totalVacations) * 100) : 0;

    return (
        <Box>
            <Box mb={6}>
                <Text fontSize="2xl" fontWeight="800" color="text.primary">
                    Welcome back, {user.firstName}
                </Text>
                <Text fontSize="sm" color="text.secondary">
                    Here's what's happening in your HR platform today
                </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mb={8}>
                {hasPermission('view_all_employees') && (
                    <StatCard
                        label="Total Employees"
                        value={activeEmployees}
                        icon="people"
                        color="brand.500"
                        change="+3 this month"
                        changeType="positive"
                    />
                )}
                {hasPermission('approve_vacations') && (
                    <StatCard
                        label="Pending Vacations"
                        value={pendingVacations}
                        icon="calendar_month"
                        color="orange.500"
                        change={`${approvalRate}% approval rate`}
                        changeType="neutral"
                    />
                )}
                {hasPermission('access_accounting') && (
                    <StatCard
                        label="Pending Payroll"
                        value={pendingPayroll}
                        icon="payments"
                        color="red.500"
                        change="Review required"
                        changeType="negative"
                    />
                )}
                {hasPermission('access_candidates') && (
                    <StatCard
                        label="Active Candidates"
                        value={activeCandidates}
                        icon="person_search"
                        color="green.500"
                        change="+5 this week"
                        changeType="positive"
                    />
                )}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" overflow="hidden">
                    <Box p={5} borderBottom="1px solid" borderColor="border.default">
                        <Text fontWeight="700" fontSize="md" color="text.primary">
                            Recent Activity
                        </Text>
                    </Box>
                    <Box>
                        {recentActivities.map((activity) => (
                            <HStack
                                key={activity.id}
                                p={4}
                                borderBottom="1px solid"
                                borderColor="border.muted"
                                gap={3}
                                align="start"
                                _hover={{ bg: 'surface.secondary' }}
                            >
                                <Box
                                    w="32px"
                                    h="32px"
                                    borderRadius="lg"
                                    bg={
                                        activity.type === 'vacation'
                                            ? 'blue.50'
                                            : activity.type === 'salary'
                                              ? 'green.50'
                                              : activity.type === 'candidate'
                                                ? 'purple.50'
                                                : activity.type === 'payroll'
                                                  ? 'orange.50'
                                                  : 'gray.50'
                                    }
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    flexShrink={0}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontSize: '16px',
                                            color:
                                                activity.type === 'vacation'
                                                    ? '#3b82f6'
                                                    : activity.type === 'salary'
                                                      ? '#10b981'
                                                      : activity.type === 'candidate'
                                                        ? '#8b5cf6'
                                                        : activity.type === 'payroll'
                                                          ? '#f59e0b'
                                                          : '#6b7280',
                                        }}
                                    >
                                        {activity.type === 'vacation'
                                            ? 'calendar_month'
                                            : activity.type === 'salary'
                                              ? 'payments'
                                              : activity.type === 'candidate'
                                                ? 'person_search'
                                                : activity.type === 'payroll'
                                                  ? 'receipt_long'
                                                  : 'info'}
                                    </span>
                                </Box>
                                <Box flex={1} minW={0}>
                                    <Text fontSize="sm" color="text.primary" fontWeight="500">
                                        {activity.details}
                                    </Text>
                                    <Text fontSize="xs" color="text.muted" mt={0.5}>
                                        by {activity.userName} · {getRelativeTime(activity.timestamp)}
                                    </Text>
                                </Box>
                            </HStack>
                        ))}
                    </Box>
                </Box>

                <VStack gap={6} align="stretch">
                    {upcomingBirthdays.length > 0 && (
                        <Box
                            bg="white"
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="border.default"
                            overflow="hidden"
                        >
                            <Box p={5} borderBottom="1px solid" borderColor="border.default">
                                <Text fontWeight="700" fontSize="md" color="text.primary">
                                    Upcoming Birthdays
                                </Text>
                            </Box>
                            <Box>
                                {upcomingBirthdays.map((emp) => (
                                    <HStack
                                        key={emp.id}
                                        p={4}
                                        borderBottom="1px solid"
                                        borderColor="border.muted"
                                        gap={3}
                                    >
                                        <Box
                                            w="36px"
                                            h="36px"
                                            borderRadius="lg"
                                            bg="pink.50"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexShrink={0}
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: '18px', color: '#ec4899' }}
                                            >
                                                cake
                                            </span>
                                        </Box>
                                        <Box flex={1}>
                                            <Text fontSize="sm" fontWeight="600" color="text.primary">
                                                {emp.firstName} {emp.lastName}
                                            </Text>
                                            <Text fontSize="xs" color="text.secondary">
                                                {emp.position} · {emp.department}
                                            </Text>
                                        </Box>
                                        <Text fontSize="xs" color="text.muted">
                                            {formatDate(emp.dateOfBirth)}
                                        </Text>
                                    </HStack>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" overflow="hidden">
                        <Box p={5} borderBottom="1px solid" borderColor="border.default">
                            <Text fontWeight="700" fontSize="md" color="text.primary">
                                Department Overview
                            </Text>
                        </Box>
                        <Box p={4}>
                            {Object.entries(
                                employees.reduce(
                                    (acc, emp) => {
                                        acc[emp.department] = (acc[emp.department] || 0) + 1;
                                        return acc;
                                    },
                                    {} as Record<string, number>,
                                ),
                            )
                                .sort((a, b) => b[1] - a[1])
                                .map(([dept, count]) => (
                                    <HStack key={dept} justify="space-between" py={2}>
                                        <Text fontSize="sm" color="text.primary">
                                            {dept}
                                        </Text>
                                        <Badge bg="brand.50" color="brand.600" borderRadius="md" px={2} fontSize="xs">
                                            {count}
                                        </Badge>
                                    </HStack>
                                ))}
                        </Box>
                    </Box>
                </VStack>
            </SimpleGrid>
        </Box>
    );
}
