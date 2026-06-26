import type { UserRole } from '../types';

export const NAV_ITEMS: Record<UserRole, { label: string; path: string; icon: string }[]> = {
    head_of_hr: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Employees', path: '/employees', icon: 'people' },
        { label: 'Vacations', path: '/vacations', icon: 'calendar_month' },
        { label: 'Salary', path: '/salary', icon: 'payments' },
        { label: 'Accounting', path: '/accounting', icon: 'account_balance' },
        { label: 'Recruitment', path: '/recruitment', icon: 'person_search' },
        { label: 'Org Chart', path: '/org-chart', icon: 'account_tree' },
        { label: 'Analytics', path: '/analytics', icon: 'analytics' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    hr: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Employees', path: '/employees', icon: 'people' },
        { label: 'Vacations', path: '/vacations', icon: 'calendar_month' },
        { label: 'Salary', path: '/salary', icon: 'payments' },
        { label: 'Analytics', path: '/analytics', icon: 'analytics' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    hr_recruiter: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Recruitment', path: '/recruitment', icon: 'person_search' },
        { label: 'Pipeline', path: '/recruitment/pipeline', icon: 'view_kanban' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    hr_accounting: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Salary', path: '/salary', icon: 'payments' },
        { label: 'Accounting', path: '/accounting', icon: 'account_balance' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
};
