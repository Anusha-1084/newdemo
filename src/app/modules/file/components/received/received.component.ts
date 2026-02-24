
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: number;
  sharedByName: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-received-files',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss']
})
export class ReceivedComponent {
  files: FileItem[] = [];
  previewFileType: string = '';
  loading = false;
  error = '';
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  previewFileId: number = 0;


  previewUrl: string | null = null;               // Raw object URL for Office viewer
  safePreviewUrl: SafeResourceUrl | null = null;  // Sanitized for Angular bindings
  isPdf = false;

  private baseUrl = environment.baseUrl;
  private fetchUrl = `${this.baseUrl}/api/files/received`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadReceivedFiles();
  }

  loadReceivedFiles(): void {
    this.loading = true;
    this.error = '';

    const token = this.tokenService.getAccessToken();
    const userId = this.extractUserIdFromToken();
    if (!token || !userId) {
      this.error = 'You are not authenticated.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const params = {
      userId: userId.toString(),
      page: this.currentPage.toString(),
      size: this.pageSize.toString()
    };

    this.http.get<any>(this.fetchUrl, { headers, params }).subscribe({
      next: (res) => {
        this.files = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.error = 'Failed to load files.';
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadReceivedFiles();
    }
  }

  downloadFile(fileId: number, filename: string): void {
    const token = this.tokenService.getAccessToken();
    const userId = this.extractUserIdFromToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.baseUrl}/api/files/download/${fileId}?userId=${userId}`;

    this.http.get(url, { headers, responseType: 'blob' }).subscribe(
      (blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename || 'downloaded-file';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      },
      (err) => {
        console.error('Download failed:', err);
        alert('Unable to download file.');
      }
    );
  }
previewFile(fileId: number): void {
  const token = this.tokenService.getAccessToken();
  const userId = this.extractUserIdFromToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  const url = `${this.baseUrl}/api/files/preview/${fileId}?userId=${userId}`;

  this.previewFileId = fileId; // Used for Office Viewer iframe

  this.http.get(url, { headers, responseType: 'blob' }).subscribe({
    next: (blob) => {
      const fileType = blob.type;
      const objectUrl = URL.createObjectURL(blob);

      if (fileType === 'application/json') {
        const reader = new FileReader();
        reader.onload = () => {
          const errorJson = JSON.parse(reader.result as string);
          alert(errorJson.message || 'Preview failed');
        };
        reader.readAsText(blob);
        return;
      }

      this.previewFileType = fileType;
      this.previewUrl = objectUrl;
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      this.isPdf = fileType === 'application/pdf';
    },
    error: (err) => {
      console.error('Preview failed:', err);
      alert('Preview failed: Unsupported or corrupted file.');
    }
  });
}


  closePreview(): void {
    this.previewUrl = null;
    this.safePreviewUrl = null;
    this.isPdf = false;
  }

  getSerialNumber(index: number): number {
    return this.currentPage * this.pageSize + index + 1;
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  private extractUserIdFromToken(): number | null {
    const token = this.tokenService.getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.id ?? null;
    } catch {
      return null;
    }
  }

  shareFile(fileId: number): void {
    const sharedWithUserId = prompt("Enter the User ID to share with:");
    if (!sharedWithUserId || isNaN(Number(sharedWithUserId))) return;

    const accessType = 'VIEW';
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const url = `${this.baseUrl}/api/files/share`;
    const params = new HttpParams()
      .set("fileId", fileId.toString())
      .set("sharedWithUserId", sharedWithUserId)
      .set("accessType", accessType);

    this.http.post(url, null, { headers, params, responseType: 'text' }).subscribe({
      next: () => alert('File shared successfully!'),
      error: err => {
        console.error('Share failed:', err);
        alert('Failed to share file');
      }
    });
  }

  deleteFile(fileId: number): void {
    const confirmed = confirm('Are you sure you want to delete this file?');
    if (!confirmed) return;

    const token = this.tokenService.getAccessToken();
    const userId = this.extractUserIdFromToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.baseUrl}/api/files/${fileId}?userId=${userId}`;

    this.http.delete(url, { headers, responseType: 'text' }).subscribe(
      (response: string) => {
        alert(response);
        this.loadReceivedFiles();
      },
      (error) => {
        console.error('Delete failed:', error);
        alert('Unable to delete file.');
      }
    );
  }
  
getOfficeViewerUrl(fileId: number): string {
  const streamUrl = `${this.baseUrl}/api/files/stream/${fileId}`;
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(streamUrl)}`;
}


  
isAudio(fileType: string): boolean {
  return fileType.startsWith('audio/');
}

isVideo(fileType: string): boolean {
  return fileType.startsWith('video/') &&
         ['video/mp4', 'video/webm', 'video/ogg'].includes(fileType);
}

isOffice(fileType: string): boolean {
  return [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint'
  ].includes(fileType);
}

isImage(fileType: string): boolean {
  return fileType.startsWith('image/');
}



isText(fileType: string): boolean {
  return ['text/plain', 'text/csv', 'application/json'].includes(fileType);
}




}