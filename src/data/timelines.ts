import type { EmployeeTimelineEvent } from '../types';
import { employees } from './employees';
import { salaryHistory } from './salaries';
import { vacationRequests } from './vacations';

function generateTimelines(): EmployeeTimelineEvent[] {
    const events: EmployeeTimelineEvent[] = [];

    employees.forEach((emp) => {
        events.push({
            id: `tl-hire-${emp.id}`,
            employeeId: emp.id,
            date: emp.employmentStartDate,
            type: 'hired',
            title: 'Hired',
            description: `Joined as ${emp.position} in ${emp.department}`,
        });
    });

    salaryHistory.forEach((sh) => {
        events.push({
            id: `tl-sal-${sh.id}`,
            employeeId: sh.employeeId,
            date: sh.effectiveDate,
            type: 'salary_change',
            title: 'Salary Updated',
            description: `Salary changed from $${sh.previousSalary.toLocaleString()} to $${sh.newSalary.toLocaleString()} - ${sh.reason}`,
        });
    });

    vacationRequests
        .filter((v) => v.status === 'approved')
        .forEach((v) => {
            events.push({
                id: `tl-vac-${v.id}`,
                employeeId: v.employeeId,
                date: v.startDate,
                type: 'vacation',
                title: 'Vacation',
                description: `${v.totalDays}-day vacation: ${v.reason}`,
            });
        });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const employeeTimelines = generateTimelines();
