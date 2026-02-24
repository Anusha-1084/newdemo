// timesheet-status.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetStatusService {
  private timesheetSubmitted: boolean = false;

  setSubmitted(status: boolean) {
    this.timesheetSubmitted = status;
  }

  isSubmitted(): boolean {
    return this.timesheetSubmitted;
  }
}
