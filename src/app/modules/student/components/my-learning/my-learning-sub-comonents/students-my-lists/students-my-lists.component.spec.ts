import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsMyListsComponent } from './students-my-lists.component';

describe('StudentsMyListsComponent', () => {
  let component: StudentsMyListsComponent;
  let fixture: ComponentFixture<StudentsMyListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsMyListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsMyListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
