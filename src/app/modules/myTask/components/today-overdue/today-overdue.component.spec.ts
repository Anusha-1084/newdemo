import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayOverdueComponent } from './today-overdue.component';

describe('TodayOverdueComponent', () => {
  let component: TodayOverdueComponent;
  let fixture: ComponentFixture<TodayOverdueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayOverdueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodayOverdueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
