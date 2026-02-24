import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-pichart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './admin-pichart.component.html', 
  styleUrl: './admin-pichart.component.scss'
})
export class AdminPichartComponent {
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Students', 'Admins'],
    datasets: [{
      data: [0, 0]
    }]
  };
  isLoading: boolean = true;
  constructor(private http: HttpClient) {} 

  ngOnInit() {
    this.fetchUserCounts();
  }

  fetchUserCounts(): void {
    this.http.get<any>('http://localhost:8888/api/v1/users/user-counts')
      .subscribe((response) => {
        if (response && response.data) {
          const userCounts = response.data;
          this.updateChartData(userCounts.students, userCounts.admins);
          this.isLoading = false;
        }
      }, (error) => {
        console.error('Error fetching user counts:', error);
        this.isLoading = false;
      });
  }
  updateChartData(students: number, admins: number) {
    this.pieChartData.datasets[0].data = [students, admins];
    this.pieChartData = { ...this.pieChartData };
  }
}
