import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  totalRequests = 3;
  approvedRequests = 1;
  totalDaysTaken = 5;
  averageDaysPerRequest = 5;

  // Pie Chart (Leave Type Distribution)
  leaveTypeChart: ChartConfiguration<'pie'>['data'] = {
    labels: ['Sick Leave', 'Casual Leave', 'Earned Leave'],
    datasets: [
      {
        data: [2, 1, 2],
        backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b'],
      },
    ],
  };

  leaveTypeOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  // Line Chart (Monthly Leave Trends)
  leaveTrendChart: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Leaves Taken',
        data: [1, 0, 2, 1, 0, 1],
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      },
    ],
  };

  leaveTrendOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' } },
    },
  };
}
