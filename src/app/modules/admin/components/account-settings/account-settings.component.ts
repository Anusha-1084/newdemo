import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {
  selectedOption: string = '';

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
