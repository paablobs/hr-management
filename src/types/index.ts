export type UserRole = 'head_of_hr' | 'hr' | 'hr_recruiter' | 'hr_accounting';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar: string;
    department: string;
    phone: string;
    hireDate: string;
}

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    age: number;
    nationalId: string;
    address: string;
    department: string;
    position: string;
    employmentStartDate: string;
    employmentStatus: 'active' | 'inactive' | 'terminated';
    email: string;
    phone: string;
    avatar: string;
    managerId?: string;
    salary: number;
}

export type VacationStatus = 'pending' | 'approved' | 'rejected';

export interface VacationRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    status: VacationStatus;
    reason: string;
    createdAt: string;
    reviewedBy?: string;
    reviewedAt?: string;
}

export interface SalaryHistory {
    id: string;
    employeeId: string;
    effectiveDate: string;
    previousSalary: number;
    newSalary: number;
    reason: string;
}

export type PayrollStatus = 'paid' | 'pending' | 'failed';

export interface PayrollEntry {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    salaryAmount: number;
    paymentDate: string | null;
    paymentStatus: PayrollStatus;
    month: string;
    year: number;
}

export type CandidateStatus =
    | 'new'
    | 'screening'
    | 'interview'
    | 'technical_interview'
    | 'offer'
    | 'hired'
    | 'rejected';

export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    desiredPosition: string;
    yearsOfExperience: number;
    skills: string[];
    applicationDate: string;
    status: CandidateStatus;
    notes: string;
    avatar: string;
}

export interface Activity {
    id: string;
    userId: string;
    userName: string;
    action: string;
    targetEntity: string;
    targetId: string;
    details: string;
    timestamp: string;
    type: 'vacation' | 'salary' | 'candidate' | 'payroll' | 'employee';
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    link?: string;
}

export interface OrgNode {
    id: string;
    name: string;
    position: string;
    department: string;
    avatar: string;
    children: OrgNode[];
}

export interface DepartmentCount {
    department: string;
    count: number;
}

export interface MonthlyPayrollSummary {
    month: string;
    totalPaid: number;
    totalPending: number;
    totalFailed: number;
    totalAmount: number;
}

export interface RecruitmentFunnel {
    status: string;
    count: number;
}

export interface EmployeeTimelineEvent {
    id: string;
    employeeId: string;
    date: string;
    type: 'hired' | 'salary_change' | 'department_transfer' | 'promotion' | 'vacation' | 'review';
    title: string;
    description: string;
}

export interface AppSettings {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    notifications: {
        emailNotifications: boolean;
        vacationAlerts: boolean;
        payrollAlerts: boolean;
        recruitmentAlerts: boolean;
    };
    appearance: {
        compactMode: boolean;
        showAvatars: boolean;
    };
}

export const ROLE_LABELS: Record<UserRole, string> = {
    head_of_hr: 'Head of HR',
    hr: 'HR Manager',
    hr_recruiter: 'HR Recruiter',
    hr_accounting: 'HR Accounting',
};

export const DEPARTMENTS = [
    'Engineering',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Human Resources',
    'Product',
    'Design',
    'Legal',
    'Customer Support',
] as const;

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
    new: 'New',
    screening: 'Screening',
    interview: 'Interview',
    technical_interview: 'Technical Interview',
    offer: 'Offer',
    hired: 'Hired',
    rejected: 'Rejected',
};

export const VACATION_STATUS_LABELS: Record<VacationStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
};

export const PAYROLL_STATUS_LABELS: Record<PayrollStatus, string> = {
    paid: 'Paid',
    pending: 'Pending',
    failed: 'Failed',
};
