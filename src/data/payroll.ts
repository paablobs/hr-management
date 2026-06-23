import type { PayrollEntry } from '../types';

const months = [
    '2025-07',
    '2025-08',
    '2025-09',
    '2025-10',
    '2025-11',
    '2025-12',
    '2026-01',
    '2026-02',
    '2026-03',
    '2026-04',
    '2026-05',
    '2026-06',
];
const years = [2025, 2025, 2025, 2025, 2025, 2025, 2026, 2026, 2026, 2026, 2026, 2026];

const employeePayrollData: { id: string; name: string; dept: string; salary: number }[] = [
    { id: 'emp-001', name: 'Alexander Crawford', dept: 'Engineering', salary: 185000 },
    { id: 'emp-002', name: 'Jessica Reynolds', dept: 'Marketing', salary: 145000 },
    { id: 'emp-003', name: 'Marcus Johnson', dept: 'Sales', salary: 125000 },
    { id: 'emp-004', name: 'Sophia Patel', dept: 'Engineering', salary: 155000 },
    { id: 'emp-005', name: 'Daniel Kim', dept: 'Engineering', salary: 120000 },
    { id: 'emp-006', name: 'Olivia Thompson', dept: 'Design', salary: 130000 },
    { id: 'emp-007', name: 'Ethan Wright', dept: 'Finance', salary: 140000 },
    { id: 'emp-008', name: 'Ava Martinez', dept: 'Operations', salary: 110000 },
    { id: 'emp-009', name: 'William Davis', dept: 'Engineering', salary: 165000 },
    { id: 'emp-010', name: 'Isabella Lopez', dept: 'Marketing', salary: 95000 },
    { id: 'emp-011', name: "James O'Connor", dept: 'Sales', salary: 95000 },
    { id: 'emp-012', name: 'Mia Nguyen', dept: 'Product', salary: 135000 },
    { id: 'emp-013', name: 'Benjamin Foster', dept: 'Legal', salary: 155000 },
    { id: 'emp-014', name: 'Charlotte Rivera', dept: 'Customer Support', salary: 85000 },
    { id: 'emp-015', name: 'Lucas Stewart', dept: 'Engineering', salary: 135000 },
    { id: 'emp-016', name: 'Amelia Cruz', dept: 'Design', salary: 100000 },
    { id: 'emp-017', name: 'Henry Brooks', dept: 'Operations', salary: 150000 },
    { id: 'emp-018', name: 'Evelyn Sanders', dept: 'Marketing', salary: 78000 },
    { id: 'emp-019', name: 'Alexander Price', dept: 'Sales', salary: 82000 },
    { id: 'emp-020', name: 'Harper Coleman', dept: 'Finance', salary: 92000 },
];

function getStatusForMonth(monthIndex: number, empIndex: number): 'paid' | 'pending' | 'failed' {
    if (monthIndex < 9) return 'paid';
    if (monthIndex === 9) return empIndex % 7 === 0 ? 'failed' : 'paid';
    if (monthIndex === 10) return empIndex % 3 === 0 ? 'pending' : 'paid';
    return empIndex % 4 === 0 ? 'pending' : empIndex % 9 === 0 ? 'failed' : 'paid';
}

export const payrollEntries: PayrollEntry[] = [];

months.forEach((month, mIdx) => {
    employeePayrollData.forEach((emp, eIdx) => {
        const status = getStatusForMonth(mIdx, eIdx);
        payrollEntries.push({
            id: `pay-${month}-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.dept,
            salaryAmount: Math.round(emp.salary / 12),
            paymentDate: status === 'paid' ? `${month}-28` : null,
            paymentStatus: status,
            month,
            year: years[mIdx],
        });
    });
});
