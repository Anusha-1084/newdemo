import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetHomeComponent } from './timesheet-home.component';

describe('TimesheetHomeComponent', () => {
  let component: TimesheetHomeComponent;
  let fixture: ComponentFixture<TimesheetHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimesheetHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
