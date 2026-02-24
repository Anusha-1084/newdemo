import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsPichartComponent } from './students-pichart.component';

describe('CoursesPichartComponent', () => {
  let component: StudentsPichartComponent;
  let fixture: ComponentFixture<StudentsPichartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsPichartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsPichartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
