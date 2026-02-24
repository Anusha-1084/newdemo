import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPichartComponent } from './admin-pichart.component';

describe('AdminPichartComponent', () => {
  let component: AdminPichartComponent;
  let fixture: ComponentFixture<AdminPichartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPichartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPichartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
