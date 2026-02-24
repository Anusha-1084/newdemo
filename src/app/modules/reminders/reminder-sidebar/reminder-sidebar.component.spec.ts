import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderSidebarComponent } from './reminder-sidebar.component';

describe('ReminderSidebarComponent', () => {
  let component: ReminderSidebarComponent;
  let fixture: ComponentFixture<ReminderSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReminderSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
