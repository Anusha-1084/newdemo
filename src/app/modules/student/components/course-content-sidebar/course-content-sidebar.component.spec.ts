import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseContentSidebarComponent } from './course-content-sidebar.component';

describe('CourseContentSidebarComponent', () => {
  let component: CourseContentSidebarComponent;
  let fixture: ComponentFixture<CourseContentSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseContentSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseContentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
