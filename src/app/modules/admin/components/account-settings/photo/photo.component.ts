import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports :[
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent {
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      console.log('Uploading:', this.selectedFile.name);      
    } else {
      alert('Please select a file to upload.');
    }
  }

  saveChanges(): void {
    console.log('Changes saved.');
  }
}
