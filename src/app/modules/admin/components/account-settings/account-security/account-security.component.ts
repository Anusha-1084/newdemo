import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-security',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './account-security.component.html',
  styleUrl: './account-security.component.scss'
})
export class AccountSecurityComponent {
onSave() {
throw new Error('Method not implemented.');
}
  user = {
    email : '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  };
}
