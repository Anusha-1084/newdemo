
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginMainComponent } from './login-main.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginMainComponent', () => {
  let component: LoginMainComponent;
  let fixture: ComponentFixture<LoginMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginMainComponent,
        LoginComponent,
        RegisterComponent
      ],
      imports: [
        FormsModule,
        BrowserAnimationsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the LoginMainComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should default to signin tab', () => {
    expect(component.setActiveTab).toBe('signin');
  });

  it('should switch to signup tab', () => {
    component.switchTab('signup');
    expect(component.setActiveTab).toBe('signup');
  });
});
