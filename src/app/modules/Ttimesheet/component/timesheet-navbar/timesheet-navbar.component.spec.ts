import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetNavbarComponent } from './timesheet-navbar.component';

describe('TimesheetNavbarComponent', () => {
  let component: TimesheetNavbarComponent;
  let fixture: ComponentFixture<TimesheetNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimesheetNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
