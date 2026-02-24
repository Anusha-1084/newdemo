import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsArchivedComponent } from './students-archived.component';

describe('StudentsArchivedComponent', () => {
  let component: StudentsArchivedComponent;
  let fixture: ComponentFixture<StudentsArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsArchivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
