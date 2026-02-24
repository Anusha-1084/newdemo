import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-students-pichart',
  standalone: true,
  imports: [],
  templateUrl: './students-pichart.component.html',
  styleUrls: ['./students-pichart.component.scss']
})
export class StudentsPichartComponent implements OnInit {
  chart: any;

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('studentsChart', {
      type: 'bar',
      data: {
        labels: ['2018', '2019', '2020', '2021', '2022'],
        datasets: [{
          label: 'Students Enrollment',
          data: [100, 200, 300, 400, 500],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
