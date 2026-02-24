import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsLearningToolsComponent } from './students-learning-tools.component';

describe('StudentsLearningToolsComponent', () => {
  let component: StudentsLearningToolsComponent;
  let fixture: ComponentFixture<StudentsLearningToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsLearningToolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsLearningToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
