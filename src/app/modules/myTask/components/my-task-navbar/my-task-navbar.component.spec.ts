import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTaskNavbarComponent } from './my-task-navbar.component';

describe('MyTaskNavbarComponent', () => {
  let component: MyTaskNavbarComponent;
  let fixture: ComponentFixture<MyTaskNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTaskNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyTaskNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
