import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimesheetService } from 'src/app/core/services/timesheet/timesheet.service';
import { UserService } from 'src/app/core/services/userservice/user.service';
import { TimesheetRequest } from 'src/app/models/timesheet-request.model';
import { User } from 'src/app/models/user.model';
import { LeaveService } from 'src/app/core/services/leave/leave.service';
import { HolidayService } from 'src/app/core/services/leave/holiday.service';



@Component({
  selector: 'app-timesheet-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheet-home.component.html',
  styleUrl: './timesheet-home.component.scss',
})
export class TimesheetHomeComponent implements OnInit {
  currentUser: User | null = null;
  userId = '';
  username = '';
  today: Date = new Date();
  currentTime: string = '';

  displayedDate: Date = new Date(); // used for dynamic heading

  selectedDate: Date | null = null;
  showModal = false;
  workDone = '';
  blockers = '';
  plans = '';
  submittedDates: Set<string> = new Set();

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  weekDays: string[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  calendarDates: any[] = [];
  calendarTable: any[][] = [];
  holidays: any[] = [];
leaves: any[] = [];


  constructor(
    private timesheetService: TimesheetService,
    private userService: UserService,
      private leaveService: LeaveService,
  private holidayService: HolidayService
      ) {}

  ngOnInit(): void {
    this.generateYearRange();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    this.onMonthOrYearChange(); // Initial calendar and heading

    this.userService.getUserProfile().subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user;
          this.userId = user.id.toString();
          this.username = user.firstName + ' ' + user.lastName;
        } else {
          console.warn('No user data available.');
        }
      },
      error: (err) => {
        console.error('Failed to fetch user profile', err);
      },
    });
  }

  updateTime() {
    this.currentTime = new Date().toLocaleTimeString();
  }

  generateYearRange() {
    const currentYear = new Date().getFullYear();
    const range = 10;
    for (let i = currentYear - range; i <= currentYear + range; i++) {
      this.years.push(i);
    }
  }

  generateCalendar() {
    const start = new Date(this.selectedYear, this.selectedMonth, 1);
    const startDay = start.getDay();

    this.calendarDates = [];
    this.calendarTable = [];

    const currentMonth = start.getMonth();
    let currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() - startDay);
    

    for (let week = 0; week < 6; week++) {
      const weekRow: any[] = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(currentDate);
        const isToday = this.isSameDate(date, this.today);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isYesterday = this.isSameDate(date, this.addDays(this.today, -1));
        const isTomorrow = this.isSameDate(date, this.addDays(this.today, 1));

        let disabled = false;
        let message = '';

        if (date.getMonth() !== currentMonth) {
          weekRow.push(null);
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        if (isYesterday) {
          disabled = true;
          message = 'This is expired.';
        } else if (isTomorrow) {
          disabled = true;
          message = 'Not allowed. This is for tomorrow’s update.';
        } else if (isWeekend) {
          disabled = true;
          message = 'It’s a weekend. Enjoy your weekend!';
        } else if (!isToday || !this.isCurrentMonthYearDisplayed()) {
          disabled = true;
          message = "Only today's entry is allowed.";
        } else if (this.submittedDates.has(this.formatDate(date))) {
          disabled = true;
          message = 'Already submitted.';
        }
const formattedDate = this.formatDate(date);

const holiday = this.holidays?.find(
  (h: any) => h.date === formattedDate
);

const leave = this.leaves?.find(
  (l: any) =>
    l.status === 'APPROVED' &&
    formattedDate >= l.startDate &&
    formattedDate <= l.endDate
);

weekRow.push({
  date,
  isToday,
  isWeekend,
  disabled,
  message,
  holiday,
  leave
});


        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.calendarTable.push(weekRow);
    }
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

 formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}


  isCurrentMonthYearDisplayed(): boolean {
    const now = new Date();
    return this.selectedMonth === now.getMonth() &&
           this.selectedYear === now.getFullYear();
  }

  onMonthOrYearChange() {
  this.displayedDate = new Date(this.selectedYear, this.selectedMonth, 1);
  this.loadCalendarData();   // 🔥 backend call
}


  goToPreviousMonth() {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.onMonthOrYearChange();
  }

  goToNextMonth() {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.onMonthOrYearChange();
  }

  onDateClick(dateObj: any) {
    if (!dateObj.disabled && dateObj.isToday) {
      this.selectedDate = dateObj.date;
      this.showModal = true;
    }
  }

  submitTimesheet() {
    const payload: TimesheetRequest = {
      userId: this.userId,
      username: this.username,
      workDone: this.workDone,
      blockers: this.blockers,
      tasksForTomorrow: this.plans,
    };

    this.timesheetService.submitTimesheet(payload).subscribe({
      next: (response: string) => {
        alert(response);
        this.showModal = false;
        this.clearForm();
        this.submittedDates.add(this.formatDate(this.today));
        this.generateCalendar();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to submit timesheet.');
      },
    });
  }

  clearForm() {
    this.workDone = '';
    this.blockers = '';
    this.plans = '';
  }
  tryGenerateCalendar() {
  if (this.holidays && this.leaves) {
    this.generateCalendar();
  }
}

  
  loadCalendarData() {

  // 1️⃣ Load holidays
  this.holidayService.getAllHolidays().subscribe({
    next: (holidays) => {
      this.holidays = holidays;
      this.tryGenerateCalendar();
    }
  });

  // 2️⃣ Load leaves
  this.leaveService
    .getMonthlyCalendar(this.selectedYear, this.selectedMonth + 1)
    .subscribe({
      next: (res) => {
        this.leaves = res.leaves || [];
        this.tryGenerateCalendar();
      }
    });
}

}

