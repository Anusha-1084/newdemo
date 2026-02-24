import { TestBed } from '@angular/core/testing';

import { ReminderNotifierService } from './reminder-notifier.service';

describe('ReminderNotifierService', () => {
  let service: ReminderNotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReminderNotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
