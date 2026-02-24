import { Component, OnInit } from '@angular/core';
import { ReminderService } from '../reminder.service';
import { Reminder } from 'src/app/models/reminder.model';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-reminder-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'] 
})
export class ReminderListComponent {
  reminders: Reminder[] = [];
  filteredReminders: Reminder[] = [];
  searchKeyword: string = '';
  statusFilter: string = 'all';
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
  constructor(
    private reminderService: ReminderService,
    private router: Router,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    const now = new Date();
    this.reminderService.getReminders().subscribe(data => {
      this.reminders = data.map(reminder => {
        const dueDate = new Date(reminder.dueDateTime);
        return {
          ...reminder,
          notified: dueDate < now
        };
      });
      this.applyFilters();
    });
  }

  editReminder(id: number): void {
    this.router.navigate(['/layout/reminders', id, 'edit']);
  }

  deleteReminder(id: number): void {
    if (confirm('Are you sure to delete this reminder?')) {
      this.reminderService.deleteReminder(id).subscribe(() => {
        this.snackbar.show('Reminder deleted');
        this.loadReminders();
      });
    }
  }
  downloadAttachment(path: string): void {
    // Extract filename from full path
    const fileName = path.split('/').pop()!;
    const baseUrl = environment.baseUrl;
    const url = `${baseUrl}/api/attachments/download/${encodeURIComponent(fileName)}`;
    window.open(url, '_blank');
  }
  applyFilters(): void {
    const now = new Date();

    const hasSearch = this.searchKeyword.trim() !== '';
    const hasStatus = this.statusFilter !== 'all';
    const hasDateRange = this.dateRange.start !== null && this.dateRange.end !== null;

    // If no filters applied, show all
    if (!hasSearch && !hasStatus && !hasDateRange) {
      this.filteredReminders = [...this.reminders]; // clone original
      return;
    }

    // Apply filters
    this.filteredReminders = this.reminders.filter(reminder => {
      const dueDate = new Date(reminder.dueDateTime);

      const titleMatch = !hasSearch || reminder.title.toLowerCase().includes(this.searchKeyword.toLowerCase());

      let statusMatch = true;
      if (hasStatus) {
        statusMatch =
          this.statusFilter === 'upcoming' ? dueDate > now :
            this.statusFilter === 'past' ? dueDate < now : true;
      }

      const dateMatch = !hasDateRange || (dueDate >= this.dateRange.start! && dueDate <= this.dateRange.end!);

      return titleMatch && statusMatch && dateMatch;
    });
  }
}
