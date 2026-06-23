import { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, HStack, Input, Select, createListCollection } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { hrUsers } from '../../data/hr-users';
import { ROLE_LABELS } from '../../types';
import { getInitials } from '../../utils/format';

export function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const [selectedUser, setSelectedUser] = useState('');

    if (isAuthenticated) return null;

    return (
        <Box minH="100vh" bg="surface.secondary" display="flex" alignItems="center" justifyContent="center" p={4}>
            <Box
                bg="white"
                borderRadius="2xl"
                p={8}
                w="100%"
                maxW="440px"
                boxShadow="0 20px 60px rgba(0,0,0,0.08)"
                border="1px solid"
                borderColor="border.default"
            >
                <Box textAlign="center" mb={8}>
                    <Box
                        w="56px"
                        h="56px"
                        bg="brand.500"
                        borderRadius="xl"
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        mb={4}
                    >
                        <Text color="white" fontWeight="bold" fontSize="lg">
                            HR
                        </Text>
                    </Box>
                    <Text fontSize="2xl" fontWeight="800" color="text.primary">
                        HR Management Platform
                    </Text>
                    <Text fontSize="sm" color="text.secondary" mt={1}>
                        Select a demo account to continue
                    </Text>
                </Box>

                <VStack gap={3} align="stretch">
                    {hrUsers.map((user) => (
                        <Button
                            key={user.id}
                            variant="outline"
                            justifyContent="flex-start"
                            h="auto"
                            p={4}
                            borderRadius="xl"
                            borderColor={selectedUser === user.id ? 'brand.500' : 'border.default'}
                            bg={selectedUser === user.id ? 'brand.50' : 'white'}
                            _hover={{ borderColor: 'brand.300', bg: 'brand.50' }}
                            onClick={() => {
                                setSelectedUser(user.id);
                                login(user.id);
                            }}
                        >
                            <HStack gap={3} w="100%">
                                <Box
                                    w="40px"
                                    h="40px"
                                    borderRadius="lg"
                                    bg="brand.100"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    flexShrink={0}
                                >
                                    <Text fontSize="sm" fontWeight="700" color="brand.600">
                                        {getInitials(user.firstName, user.lastName)}
                                    </Text>
                                </Box>
                                <Box textAlign="left" flex={1}>
                                    <Text fontSize="sm" fontWeight="600" color="text.primary">
                                        {user.firstName} {user.lastName}
                                    </Text>
                                    <Text fontSize="xs" color="text.secondary">
                                        {ROLE_LABELS[user.role]}
                                    </Text>
                                </Box>
                                <Box
                                    px={2}
                                    py={0.5}
                                    borderRadius="md"
                                    bg={
                                        user.role === 'head_of_hr'
                                            ? 'purple.50'
                                            : user.role === 'hr'
                                              ? 'blue.50'
                                              : user.role === 'hr_recruiter'
                                                ? 'green.50'
                                                : 'orange.50'
                                    }
                                >
                                    <Text
                                        fontSize="xs"
                                        fontWeight="600"
                                        color={
                                            user.role === 'head_of_hr'
                                                ? 'purple.600'
                                                : user.role === 'hr'
                                                  ? 'blue.600'
                                                  : user.role === 'hr_recruiter'
                                                    ? 'green.600'
                                                    : 'orange.600'
                                        }
                                    >
                                        {user.role === 'head_of_hr'
                                            ? 'Head'
                                            : user.role === 'hr_recruiter'
                                              ? 'Recruiter'
                                              : user.role === 'hr_accounting'
                                                ? 'Accounting'
                                                : 'HR'}
                                    </Text>
                                </Box>
                            </HStack>
                        </Button>
                    ))}
                </VStack>
            </Box>
        </Box>
    );
}
