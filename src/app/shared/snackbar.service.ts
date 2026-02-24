import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
