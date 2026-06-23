import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { hrUsers } from '../data/hr-users';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userId: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PERMISSIONS: Record<string, string[]> = {
    head_of_hr: [
        'view_all_employees',
        'view_hr_employees',
        'view_salaries',
        'view_salary_history',
        'approve_vacations',
        'reject_vacations',
        'access_accounting',
        'access_recruiter',
        'view_dashboard',
        'view_analytics',
        'manage_org_chart',
    ],
    hr: [
        'view_employees',
        'view_salaries',
        'view_salary_history',
        'approve_vacations',
        'reject_vacations',
        'view_dashboard',
        'view_analytics',
    ],
    hr_recruiter: [
        'access_candidates',
        'review_candidates',
        'view_candidate_details',
        'update_candidate_status',
        'view_dashboard',
    ],
    hr_accounting: ['view_salaries', 'view_salary_history', 'access_accounting', 'manage_payroll', 'view_dashboard'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('hr_auth_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('hr_auth_user');
            }
        }
    }, []);

    const login = (userId: string) => {
        const found = hrUsers.find((u) => u.id === userId);
        if (found) {
            setUser(found);
            localStorage.setItem('hr_auth_user', JSON.stringify(found));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hr_auth_user');
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        return PERMISSIONS[user.role]?.includes(permission) ?? false;
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
