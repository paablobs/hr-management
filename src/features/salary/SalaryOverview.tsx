import { Box, Text, HStack, VStack, SimpleGrid, Badge } from '@chakra-ui/react';
import { employees } from '../../data/employees';
import { salaryHistory } from '../../data/salaries';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { formatCurrency, formatDate, getInitials } from '../../utils/format';

export function SalaryOverview() {
    const { hasPermission } = useAuth();

    if (!hasPermission('view_salaries')) {
        return (
            <Box textAlign="center" py={20}>
                <Text fontSize="lg" fontWeight="700">
                    Access Denied
                </Text>
                <Text fontSize="sm" color="text.secondary">
                    You don't have permission to view salary information
                </Text>
            </Box>
        );
    }

    const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
    const avgSalary = Math.round(totalPayroll / employees.length);
    const maxSalary = Math.max(...employees.map((e) => e.salary));
    const minSalary = Math.min(...employees.map((e) => e.salary));

    const recentChanges = [...salaryHistory]
        .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))
        .slice(0, 10);

    const salaryDistribution = [
        { range: '< $80k', count: employees.filter((e) => e.salary < 80000).length },
        { range: '$80k-$100k', count: employees.filter((e) => e.salary >= 80000 && e.salary < 100000).length },
        { range: '$100k-$120k', count: employees.filter((e) => e.salary >= 100000 && e.salary < 120000).length },
        { range: '$120k-$150k', count: employees.filter((e) => e.salary >= 120000 && e.salary < 150000).length },
        { range: '$150k+', count: employees.filter((e) => e.salary >= 150000).length },
    ];

    return (
        <Box>
            <PageHeader title="Salary Overview" subtitle="Company-wide salary information" />

            <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} mb={8}>
                <StatCard
                    label="Total Payroll"
                    value={formatCurrency(totalPayroll)}
                    icon="payments"
                    color="brand.500"
                />
                <StatCard
                    label="Average Salary"
                    value={formatCurrency(avgSalary)}
                    icon="trending_up"
                    color="green.500"
                />
                <StatCard
                    label="Highest Salary"
                    value={formatCurrency(maxSalary)}
                    icon="arrow_upward"
                    color="blue.500"
                />
                <StatCard
                    label="Lowest Salary"
                    value={formatCurrency(minSalary)}
                    icon="arrow_downward"
                    color="orange.500"
                />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Salary Distribution
                    </Text>
                    <VStack gap={3} align="stretch">
                        {salaryDistribution.map((d) => (
                            <HStack key={d.range} gap={3}>
                                <Text fontSize="sm" color="text.secondary" w="100px">
                                    {d.range}
                                </Text>
                                <Box flex={1} h="24px" bg="surface.tertiary" borderRadius="md" overflow="hidden">
                                    <Box
                                        h="100%"
                                        bg="brand.500"
                                        borderRadius="md"
                                        w={`${(d.count / employees.length) * 100}%`}
                                        minW={d.count > 0 ? '20px' : '0'}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="flex-end"
                                        pr={2}
                                    >
                                        <Text fontSize="xs" color="white" fontWeight="600">
                                            {d.count}
                                        </Text>
                                    </Box>
                                </Box>
                            </HStack>
                        ))}
                    </VStack>
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Recent Salary Changes
                    </Text>
                    <VStack gap={0} align="stretch">
                        {recentChanges.map((sh) => {
                            const emp = employees.find((e) => e.id === sh.employeeId);
                            if (!emp) return null;
                            return (
                                <HStack
                                    key={sh.id}
                                    py={3}
                                    borderBottom="1px solid"
                                    borderColor="border.muted"
                                    justify="space-between"
                                >
                                    <HStack gap={3}>
                                        <Box
                                            w="32px"
                                            h="32px"
                                            borderRadius="lg"
                                            bg="brand.50"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
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
                                                {formatDate(sh.effectiveDate)}
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <Box textAlign="right">
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color={sh.newSalary > sh.previousSalary ? 'green.600' : 'red.600'}
                                        >
                                            {sh.newSalary > sh.previousSalary ? '+' : ''}
                                            {formatCurrency(sh.newSalary - sh.previousSalary)}
                                        </Text>
                                        <Text fontSize="xs" color="text.muted">
                                            {formatCurrency(sh.newSalary)}
                                        </Text>
                                    </Box>
                                </HStack>
                            );
                        })}
                    </VStack>
                </Box>
            </SimpleGrid>
        </Box>
    );
}
