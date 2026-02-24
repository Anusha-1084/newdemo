import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsWishlistComponent } from './students-wishlist.component';

describe('StudentsWishlistComponent', () => {
  let component: StudentsWishlistComponent;
  let fixture: ComponentFixture<StudentsWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsWishlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
