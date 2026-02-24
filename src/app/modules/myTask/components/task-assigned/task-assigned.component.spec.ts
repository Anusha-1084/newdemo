import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssignedComponent } from './task-assigned.component';

describe('TaskAssignedComponent', () => {
  let component: TaskAssignedComponent;
  let fixture: ComponentFixture<TaskAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAssignedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
