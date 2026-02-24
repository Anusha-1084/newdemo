import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourseModulesComponent } from './create-course-modules.component';

describe('CreateCourseModulesComponent', () => {
  let component: CreateCourseModulesComponent;
  let fixture: ComponentFixture<CreateCourseModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCourseModulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCourseModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
