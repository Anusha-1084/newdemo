import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-reminder-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './reminder-sidebar.component.html',
  styleUrls: ['./reminder-sidebar.component.scss']  // fixed typo here
})
export class ReminderSidebarComponent {

  selectedMenu: string = '';

  // form values
  title: string = '';
  status: string = 'All';
  dateRange: string = '';

  setMenu(menu: string) {
    this.selectedMenu = menu;
  }

  search() {
    console.log('Search Params:', {
      title: this.title,
      status: this.status,
      dateRange: this.dateRange
    });
  }

 }
