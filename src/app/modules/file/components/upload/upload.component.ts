import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import Compressor from 'compressorjs';


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  name: string = '';
  type: string = '';
  size: number = 0;
  receiverUsername: string = '';
  selectedFile: File | null = null;

  private baseUrl = environment.baseUrl;
  private uploadUrl = `${this.baseUrl}/api/files/upload-by-username`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // Trigger file input click to open file picker
  triggerFileInput(): void {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) input.click();
  }

  // Handle file input change and assign the file details
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.name = this.selectedFile.name;
      this.type = this.selectedFile.type;
      this.size = Math.round(this.selectedFile.size / 1024); // Size in KB
    }
  }

  // Upload the file to the backend
  uploadFile(): void {
    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }

    // Compress the image if it is an image
    if (this.selectedFile.type.startsWith('image/')) {
      new Compressor(this.selectedFile, {
        quality: 0.6,
        success: (compressedFile: Blob) => {
          this.selectedFile = new File([compressedFile], this.selectedFile!.name, {
            type: compressedFile.type
          });
          this.uploadToServer();
        },
        error: (err: Error) => {
          console.error('Compression failed:', err);
          alert('Compression failed.');
        }
      });
    } else {
      this.uploadToServer();
    }
  }

  // Handle the actual file upload to the backend
  uploadToServer(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      alert('You are not authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('name', this.selectedFile!.name);
    formData.append('type', this.selectedFile!.type);
    formData.append('size', this.selectedFile!.size.toString());
    formData.append('receiverUsername', this.receiverUsername);

    this.http.post(this.uploadUrl, formData, { headers, responseType: 'text' }).subscribe({
      next: (res) => {
        console.log('Response:', res);
        alert('File uploaded successfully');
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed. Check backend logs.');
      }
    });
  }
}