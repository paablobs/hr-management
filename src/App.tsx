import { useState, useEffect, useRef } from 'react';
import { ChakraProvider } from './contexts/ChakraProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './features/auth/LoginPage';
import { Dashboard } from './features/dashboard/Dashboard';
import { EmployeeList } from './features/employees/EmployeeList';
import { EmployeeDetail } from './features/employees/EmployeeDetail';
import { VacationManagement } from './features/vacations/VacationManagement';
import { SalaryOverview } from './features/salary/SalaryOverview';
import { AccountingModule } from './features/accounting/AccountingModule';
import { RecruitmentModule } from './features/recruitment/RecruitmentModule';
import { RecruitmentPipeline } from './features/recruitment/RecruitmentPipeline';
import { OrgChartView } from './features/org-chart/OrgChartView';
import { AnalyticsDashboard } from './features/analytics/AnalyticsDashboard';
import { SettingsModule } from './features/settings/SettingsModule';
import { Box, Text } from '@chakra-ui/react';

function getTitle(path: string): string {
    const titles: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/employees': 'Employees',
        '/vacations': 'Vacations',
        '/salary': 'Salary',
        '/accounting': 'Accounting',
        '/recruitment': 'Recruitment',
        '/recruitment/pipeline': 'Pipeline',
        '/org-chart': 'Org Chart',
        '/analytics': 'Analytics',
        '/settings': 'Settings',
    };
    if (path.startsWith('/employees/')) return 'Employee Details';
    return titles[path] || 'Dashboard';
}

function AppContent() {
    const { isAuthenticated, user } = useAuth();
    const [currentPath, setCurrentPath] = useState('/dashboard');
    const prevUserId = useRef<string | undefined>(undefined);
    const isInitialMount = useRef(true);

    useEffect(() => {
        const handlePopState = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        setCurrentPath(window.location.pathname);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevUserId.current = user?.id;
            return;
        }

        if (isAuthenticated && user?.id && prevUserId.current !== user.id) {
            setCurrentPath('/dashboard');
            window.history.pushState(null, '', '/dashboard');
        }
        prevUserId.current = user?.id;
    }, [user?.id, isAuthenticated]);

    const navigate = (path: string) => {
        window.history.pushState(null, '', path);
        setCurrentPath(path);
    };

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    const renderContent = () => {
        if (currentPath === '/dashboard') return <Dashboard />;
        if (currentPath === '/employees') return <EmployeeList onNavigate={navigate} />;
        if (currentPath.startsWith('/employees/')) {
            const id = currentPath.split('/')[2];
            return <EmployeeDetail employeeId={id} onBack={() => navigate('/employees')} />;
        }
        if (currentPath === '/vacations') return <VacationManagement />;
        if (currentPath === '/salary') return <SalaryOverview />;
        if (currentPath === '/accounting') return <AccountingModule />;
        if (currentPath === '/recruitment') return <RecruitmentModule onNavigate={navigate} />;
        if (currentPath === '/recruitment/pipeline') return <RecruitmentPipeline />;
        if (currentPath === '/org-chart') return <OrgChartView />;
        if (currentPath === '/analytics') return <AnalyticsDashboard />;
        if (currentPath === '/settings') return <SettingsModule />;
        return <Dashboard />;
    };

    return (
        <AppShell title={getTitle(currentPath)} currentPath={currentPath} onNavigate={navigate}>
            {renderContent()}
        </AppShell>
    );
}

export default function App() {
    return (
        <ChakraProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ChakraProvider>
    );
}
