import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponentLeaveManagement } from './navbar-leave-management.component';


describe('NavbarComponentLeaveManagement', () => {
  let component: NavbarComponentLeaveManagement;
  let fixture: ComponentFixture<NavbarComponentLeaveManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponentLeaveManagement]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarComponentLeaveManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
