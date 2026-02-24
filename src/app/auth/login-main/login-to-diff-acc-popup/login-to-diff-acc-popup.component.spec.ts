import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginToDiffAccPopupComponent } from './login-to-diff-acc-popup.component';

describe('LoginToDiffAccPopupComponent', () => {
  let component: LoginToDiffAccPopupComponent;
  let fixture: ComponentFixture<LoginToDiffAccPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginToDiffAccPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginToDiffAccPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
