import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSidebarComponent } from './file-sidebar.component';

describe('FileSidebarComponent', () => {
  let component: FileSidebarComponent;
  let fixture: ComponentFixture<FileSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
