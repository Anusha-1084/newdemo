import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {
  let errorMessage = 'An unknown error occurred';

  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = `Client-side error: ${error.error.message}`;
    // You can log this to an external service if needed
  } else {
    // Server-side error
    errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    // Optionally log this to an external service
    // logToExternalService(errorMessage);
  }

  // Log error to console for debugging
  console.error(errorMessage);

  // Return the error message for the UI to handle
  return throwError(errorMessage);
} 
