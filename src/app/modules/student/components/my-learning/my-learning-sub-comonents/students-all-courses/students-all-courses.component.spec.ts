import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsAllCoursesComponent } from './students-all-courses.component';

describe('StudentsAllCoursesComponent', () => {
  let component: StudentsAllCoursesComponent;
  let fixture: ComponentFixture<StudentsAllCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsAllCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsAllCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
