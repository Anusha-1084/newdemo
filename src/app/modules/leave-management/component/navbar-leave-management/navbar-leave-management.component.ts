import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navbar-leave-management.component.html',
  styleUrls: ['./navbar-leave-management.component.scss']
})
export class NavbarComponentLeaveManagement {
  onSignOut() {
    alert('Signed out successfully!');
  }
}
