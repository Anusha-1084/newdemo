import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLessonsComponent } from './create-lessons.component';

describe('CreateLessonsComponent', () => {
  let component: CreateLessonsComponent;
  let fixture: ComponentFixture<CreateLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLessonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
