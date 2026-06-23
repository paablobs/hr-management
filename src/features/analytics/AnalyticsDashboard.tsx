import { Box, Text, SimpleGrid, HStack, Badge } from '@chakra-ui/react';
import { employees } from '../../data/employees';
import { vacationRequests } from '../../data/vacations';
import { payrollEntries } from '../../data/payroll';
import { candidates } from '../../data/candidates';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';

export function AnalyticsDashboard() {
    const activeEmployees = employees.filter((e) => e.employmentStatus === 'active');
    const avgAge = Math.round(activeEmployees.reduce((s, e) => s + e.age, 0) / activeEmployees.length);
    const avgTenure =
        Math.round(
            (activeEmployees.reduce((s, e) => {
                const years = (Date.now() - new Date(e.employmentStartDate).getTime()) / (365.25 * 86400000);
                return s + years;
            }, 0) /
                activeEmployees.length) *
                10,
        ) / 10;

    const pendingVacations = vacationRequests.filter((v) => v.status === 'pending').length;
    const approvedVacations = vacationRequests.filter((v) => v.status === 'approved').length;
    const approvalRate =
        vacationRequests.length > 0 ? Math.round((approvedVacations / vacationRequests.length) * 100) : 0;

    const paidPayroll = payrollEntries.filter((p) => p.paymentStatus === 'paid').length;
    const payrollCompletion = payrollEntries.length > 0 ? Math.round((paidPayroll / payrollEntries.length) * 100) : 0;

    const activeCandidates = candidates.filter((c) => !['hired', 'rejected'].includes(c.status)).length;

    const deptDistribution = Object.entries(
        activeEmployees.reduce(
            (acc, e) => {
                acc[e.department] = (acc[e.department] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        ),
    ).sort((a, b) => b[1] - a[1]);

    const ageDistribution = [
        { range: '20-25', count: activeEmployees.filter((e) => e.age >= 20 && e.age < 26).length },
        { range: '26-30', count: activeEmployees.filter((e) => e.age >= 26 && e.age < 31).length },
        { range: '31-35', count: activeEmployees.filter((e) => e.age >= 31 && e.age < 36).length },
        { range: '36-40', count: activeEmployees.filter((e) => e.age >= 36 && e.age < 41).length },
        { range: '41+', count: activeEmployees.filter((e) => e.age >= 41).length },
    ];

    const recruitmentFunnel = [
        { stage: 'New', count: candidates.filter((c) => c.status === 'new').length },
        { stage: 'Screening', count: candidates.filter((c) => c.status === 'screening').length },
        { stage: 'Interview', count: candidates.filter((c) => c.status === 'interview').length },
        { stage: 'Technical', count: candidates.filter((c) => c.status === 'technical_interview').length },
        { stage: 'Offer', count: candidates.filter((c) => c.status === 'offer').length },
        { stage: 'Hired', count: candidates.filter((c) => c.status === 'hired').length },
    ];

    return (
        <Box>
            <PageHeader title="HR Analytics" subtitle="Key performance indicators and insights" />

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mb={8}>
                <StatCard label="Total Employees" value={activeEmployees.length} icon="people" color="brand.500" />
                <StatCard label="Average Age" value={`${avgAge} years`} icon="person" color="blue.500" />
                <StatCard label="Avg Tenure" value={`${avgTenure} years`} icon="schedule" color="green.500" />
                <StatCard label="Approval Rate" value={`${approvalRate}%`} icon="check_circle" color="purple.500" />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Employees by Department
                    </Text>
                    {deptDistribution.map(([dept, count]) => (
                        <HStack key={dept} justify="space-between" py={2}>
                            <Text fontSize="sm" color="text.primary">
                                {dept}
                            </Text>
                            <HStack gap={2}>
                                <Box w="120px" h="16px" bg="surface.tertiary" borderRadius="md" overflow="hidden">
                                    <Box
                                        h="100%"
                                        bg="brand.500"
                                        borderRadius="md"
                                        w={`${(count / activeEmployees.length) * 100}%`}
                                    />
                                </Box>
                                <Text fontSize="sm" fontWeight="600" color="text.primary" minW="30px" textAlign="right">
                                    {count}
                                </Text>
                            </HStack>
                        </HStack>
                    ))}
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Age Distribution
                    </Text>
                    {ageDistribution.map((d) => (
                        <HStack key={d.range} justify="space-between" py={2}>
                            <Text fontSize="sm" color="text.primary">
                                {d.range}
                            </Text>
                            <HStack gap={2}>
                                <Box w="120px" h="16px" bg="surface.tertiary" borderRadius="md" overflow="hidden">
                                    <Box
                                        h="100%"
                                        bg="blue.500"
                                        borderRadius="md"
                                        w={`${(d.count / activeEmployees.length) * 100}%`}
                                    />
                                </Box>
                                <Text fontSize="sm" fontWeight="600" color="text.primary" minW="30px" textAlign="right">
                                    {d.count}
                                </Text>
                            </HStack>
                        </HStack>
                    ))}
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Recruitment Funnel
                    </Text>
                    {recruitmentFunnel.map((f, idx) => (
                        <HStack key={f.stage} justify="space-between" py={2}>
                            <Text fontSize="sm" color="text.primary">
                                {f.stage}
                            </Text>
                            <HStack gap={2}>
                                <Box w="120px" h="16px" bg="surface.tertiary" borderRadius="md" overflow="hidden">
                                    <Box
                                        h="100%"
                                        bg={`hsl(${260 - idx * 30}, 70%, 60%)`}
                                        borderRadius="md"
                                        w={candidates.length > 0 ? `${(f.count / candidates.length) * 100}%` : '0%'}
                                    />
                                </Box>
                                <Text fontSize="sm" fontWeight="600" color="text.primary" minW="30px" textAlign="right">
                                    {f.count}
                                </Text>
                            </HStack>
                        </HStack>
                    ))}
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Key Metrics
                    </Text>
                    {[
                        ['Pending Vacations', pendingVacations, 'orange'],
                        ['Payroll Completion', `${payrollCompletion}%`, 'green'],
                        ['Active Recruitments', activeCandidates, 'purple'],
                        ['Departments', deptDistribution.length, 'blue'],
                        ['Total Payroll Entries', payrollEntries.length, 'cyan'],
                    ].map(([label, value, color]) => (
                        <HStack
                            key={label as string}
                            justify="space-between"
                            py={3}
                            borderBottom="1px solid"
                            borderColor="border.muted"
                        >
                            <Text fontSize="sm" color="text.secondary">
                                {label}
                            </Text>
                            <Badge
                                bg={`${color}.50`}
                                color={`${color}.600`}
                                borderRadius="md"
                                px={2}
                                fontSize="sm"
                                fontWeight="600"
                            >
                                {value}
                            </Badge>
                        </HStack>
                    ))}
                </Box>
            </SimpleGrid>
        </Box>
    );
}
