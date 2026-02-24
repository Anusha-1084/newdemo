import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavbarComponent } from './sideNavbar.component';

describe('TicketPageComponent', () => {
  let component: SideNavbarComponent;
  let fixture: ComponentFixture<SideNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
