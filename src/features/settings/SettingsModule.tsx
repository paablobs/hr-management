import { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, Button, SimpleGrid, Input, Badge } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import type { AppSettings } from '../../types';

const defaultSettings: AppSettings = {
    profile: { firstName: '', lastName: '', email: '', phone: '' },
    notifications: { emailNotifications: true, vacationAlerts: true, payrollAlerts: true, recruitmentAlerts: true },
    appearance: { compactMode: false, showAvatars: true },
};

export function SettingsModule() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem('hr_settings');
            if (stored) {
                try {
                    setSettings(JSON.parse(stored));
                } catch {}
            }
            setSettings((s) => ({
                ...s,
                profile: { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
            }));
        }
    }, [user]);

    const handleSave = () => {
        localStorage.setItem('hr_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleResetDemo = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <Box>
            <PageHeader title="Settings" subtitle="Manage your preferences" />

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Profile
                    </Text>
                    <VStack gap={4} align="stretch">
                        {(['firstName', 'lastName', 'email', 'phone'] as const).map((field) => (
                            <Box key={field}>
                                <Text fontSize="sm" color="text.secondary" mb={1} textTransform="capitalize">
                                    {field.replace(/([A-Z])/g, ' $1')}
                                </Text>
                                <Input
                                    value={settings.profile[field]}
                                    onChange={(e) =>
                                        setSettings((s) => ({
                                            ...s,
                                            profile: { ...s.profile, [field]: e.target.value },
                                        }))
                                    }
                                    size="sm"
                                    borderRadius="lg"
                                />
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Notification Preferences
                    </Text>
                    <VStack gap={4} align="stretch">
                        {(
                            [
                                ['emailNotifications', 'Email Notifications'],
                                ['vacationAlerts', 'Vacation Alerts'],
                                ['payrollAlerts', 'Payroll Alerts'],
                                ['recruitmentAlerts', 'Recruitment Alerts'],
                            ] as const
                        ).map(([key, label]) => (
                            <HStack key={key} justify="space-between">
                                <Text fontSize="sm" color="text.primary">
                                    {label}
                                </Text>
                                <Box
                                    as="button"
                                    w="44px"
                                    h="24px"
                                    borderRadius="full"
                                    bg={settings.notifications[key] ? 'brand.500' : 'gray.200'}
                                    position="relative"
                                    cursor="pointer"
                                    onClick={() =>
                                        setSettings((s) => ({
                                            ...s,
                                            notifications: { ...s.notifications, [key]: !s.notifications[key] },
                                        }))
                                    }
                                    transition="background 0.2s"
                                >
                                    <Box
                                        w="18px"
                                        h="18px"
                                        borderRadius="full"
                                        bg="white"
                                        position="absolute"
                                        top="3px"
                                        left={settings.notifications[key] ? '23px' : '3px'}
                                        transition="left 0.2s"
                                        boxShadow="sm"
                                    />
                                </Box>
                            </HStack>
                        ))}
                    </VStack>
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Appearance
                    </Text>
                    <VStack gap={4} align="stretch">
                        {(
                            [
                                ['compactMode', 'Compact Mode'],
                                ['showAvatars', 'Show Avatars'],
                            ] as const
                        ).map(([key, label]) => (
                            <HStack key={key} justify="space-between">
                                <Text fontSize="sm" color="text.primary">
                                    {label}
                                </Text>
                                <Box
                                    as="button"
                                    w="44px"
                                    h="24px"
                                    borderRadius="full"
                                    bg={settings.appearance[key] ? 'brand.500' : 'gray.200'}
                                    position="relative"
                                    cursor="pointer"
                                    onClick={() =>
                                        setSettings((s) => ({
                                            ...s,
                                            appearance: { ...s.appearance, [key]: !s.appearance[key] },
                                        }))
                                    }
                                    transition="background 0.2s"
                                >
                                    <Box
                                        w="18px"
                                        h="18px"
                                        borderRadius="full"
                                        bg="white"
                                        position="absolute"
                                        top="3px"
                                        left={settings.appearance[key] ? '23px' : '3px'}
                                        transition="left 0.2s"
                                        boxShadow="sm"
                                    />
                                </Box>
                            </HStack>
                        ))}
                    </VStack>
                </Box>

                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border.default" p={6}>
                    <Text fontWeight="700" fontSize="md" color="text.primary" mb={4}>
                        Demo Controls
                    </Text>
                    <Text fontSize="sm" color="text.secondary" mb={4}>
                        Reset all application data to initial state for demonstration purposes.
                    </Text>
                    <Button
                        bg="red.500"
                        color="white"
                        _hover={{ bg: 'red.600' }}
                        size="sm"
                        borderRadius="lg"
                        onClick={handleResetDemo}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '8px' }}>
                            restart_alt
                        </span>
                        Reset Demo Data
                    </Button>
                </Box>
            </SimpleGrid>

            <HStack mt={6} gap={3}>
                <Button
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: 'brand.600' }}
                    size="sm"
                    borderRadius="lg"
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
                {saved && (
                    <Badge bg="green.50" color="green.600" borderRadius="md" px={2}>
                        Saved!
                    </Badge>
                )}
            </HStack>
        </Box>
    );
}
