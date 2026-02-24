import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { environment } from 'src/environments/environment';
interface DayEntry {
  name: string;
  date: Date;
  hours: number;
  editable: boolean;
}

@Component({
  selector: 'app-time-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.scss'],
})
export class TimeLogComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  selectedClient: string = '';
  selectedProject: string = '';
  selectedJob: string = '';
  selectedWorkItem: string = '';

  clients: string[] = ['Client A', 'Client B', 'Client C'];
  projects: string[] = ['SWON123', 'Project Y', 'Project Z'];
  jobs: string[] = ['DEVELOPMENT', 'DESIGN', 'TESTING'];
  workItems: string[] = ['WorkItem 1', 'WorkItem 2', 'WorkItem 3'];

  view: 'weekly' | 'monthly' = 'weekly';
  weekOffset = 0;
  monthOffset = 0;

  weekDays: DayEntry[] = [];
  monthDays: DayEntry[] = [];

  // ✅ Shared global state for sync
  lockedDates: string[] = [];
  allEntries: Record<string, number> = {}; // { "2025-11-10": 8, "2025-11-11": 6 }

  ngOnInit(): void {
    this.generateWeek();
    this.loadExistingData();
  }

  setView(view: 'weekly' | 'monthly'): void {
    this.view = view;
    this.weekOffset = 0;
    this.monthOffset = 0;

    if (view === 'weekly') this.generateWeek();
    else this.generateMonth();

    // ✅ sync hours + locking between both views
    this.syncEntriesBetweenViews();

    this.loadExistingData();
  }

  changeOffset(delta: number): void {
    if (this.view === 'weekly') {
      this.weekOffset += delta;
      this.generateWeek();
    } else {
      this.monthOffset += delta;
      this.generateMonth();
    }

    // ✅ Keep synced
    this.syncEntriesBetweenViews();

    this.loadExistingData();
  }

  generateWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday + this.weekOffset * 7);

    const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const normalized = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const iso = normalized.toISOString().split('T')[0];
      return {
        name: dayNames[i],
        date: normalized,
        hours: this.allEntries[iso] || 0, // ✅ sync from global
        editable: !this.lockedDates.includes(iso)
      };
    });
  }

  generateMonth(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + this.monthOffset;
    const totalDays = new Date(year, month + 1, 0).getDate();

    this.monthDays = Array.from({ length: totalDays }, (_, i) => {
      const d = new Date(Date.UTC(year, month, i + 1));
      const iso = d.toISOString().split('T')[0];
      return {
        date: d,
        hours: this.allEntries[iso] || 0, // ✅ sync from global
        name: d.toLocaleDateString(undefined, { weekday: 'long' }),
        editable: !this.lockedDates.includes(iso)
      };
    });
  }

  getCurrentRange(): string {
    if (this.view === 'weekly') {
      const start = this.weekDays[0]?.date;
      const end = this.weekDays[6]?.date;
      if (!start || !end) return '';
      const options = { month: 'short', day: 'numeric' } as const;
      return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
    } else {
      const firstDay = this.monthDays[0]?.date;
      if (!firstDay) return '';
      const options = { month: 'long', year: 'numeric' } as const;
      return firstDay.toLocaleDateString(undefined, options);
    }
  }

  getTotalHours(): number {
    const entries = this.view === 'weekly' ? this.weekDays : this.monthDays;
    return entries.reduce((sum, day) => sum + (day.hours || 0), 0);
  }

  saveDraft(): void {
    const data = this.view === 'weekly' ? this.weekDays : this.monthDays;
    console.log('📝 Draft saved', data);
    alert('Draft saved locally! (not sent to backend)');
  }

  submit(): void {
    if (!this.selectedProject || !this.selectedJob) {
      alert('Please select a project and job!');
      return;
    }

    const entries = (this.view === 'weekly' ? this.weekDays : this.monthDays)
      .filter(day => day.hours > 0)
      .map(day => ({
        workDate: day.date.toISOString().split('T')[0],
        hoursWorked: day.hours
      }));

    const invalid = entries.find(e => e.hoursWorked > 12);
    if (invalid) {
      alert(`Enter correct timing — maximum 12 hours per day.`);
      return;
    }

    if (entries.length === 0) {
      alert('No hours entered for submission!');
      return;
    }

    const payload = {
      startDate: (this.view === 'weekly' ? this.weekDays[0] : this.monthDays[0]).date.toISOString().split('T')[0],
      endDate: (this.view === 'weekly'
        ? this.weekDays[this.weekDays.length - 1]
        : this.monthDays[this.monthDays.length - 1]).date.toISOString().split('T')[0],
      timesheetType: this.view === 'weekly' ? 'WEEKLY' : 'MONTHLY',
      job: this.selectedJob.toUpperCase(),
      projectId: this.selectedProject,
      entries
    };

    const token = this.authService.getAccessToken();
    this.http.post(`${environment.apiUrl}/timesheet/log`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: () => {
        alert('Timesheet submitted successfully!');

        // ✅ Update global state
        entries.forEach(e => {
          this.allEntries[e.workDate] = e.hoursWorked;
        });

        const submittedIsoDates = entries.map(e => e.workDate);
        this.lockedDates = Array.from(new Set([...this.lockedDates, ...submittedIsoDates]));

        // ✅ Apply globally to both views
        this.syncEntriesBetweenViews();

        this.loadExistingData();
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.message || 'Submission failed!';
        alert(msg);
      },
    });
  }

  // ✅ Core sync function (NEW)
  private syncEntriesBetweenViews(): void {
    const applySync = (days: DayEntry[]) => {
      days.forEach(day => {
        const iso = day.date.toISOString().split('T')[0];
        if (this.allEntries[iso] !== undefined) day.hours = this.allEntries[iso];
        day.editable = !this.lockedDates.includes(iso);
      });
    };
    applySync(this.weekDays);
    applySync(this.monthDays);
  }

  // ✅ Load & lock from backend (unchanged, just merged into global state)
  loadExistingData(): void {
    const daysArray = this.view === 'weekly' ? this.weekDays : this.monthDays;
    if (!daysArray || daysArray.length === 0) return;

    const start = daysArray[0].date.toISOString().split('T')[0];
    const end = daysArray[daysArray.length - 1].date.toISOString().split('T')[0];

    const token = this.authService.getAccessToken();
    this.http.get<any>(`${environment.apiUrl}/timesheet/view?startDate=${start}&endDate=${end}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (res) => {
        const entries = res?.data?.entries || [];
        const lockedDays: string[] = res?.data?.lockedDays || [];
        const isTimesheetEditable: boolean = res?.data?.editable ?? true;

        // ✅ Merge backend data globally
        entries.forEach((e: any) => this.allEntries[e.workDate] = e.hoursWorked);
        this.lockedDates = Array.from(new Set([...this.lockedDates, ...lockedDays]));

        // ✅ Sync everything
        this.syncEntriesBetweenViews();

        console.log(`📅 Loaded ${entries.length} entries (${start} → ${end}), locked ${this.lockedDates.length} days`);
      },
      error: (err) => console.error('❌ Load failed', err),
    });
  }
}
