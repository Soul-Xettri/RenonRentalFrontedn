import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbookinghistoryComponent } from './userbookinghistory.component';

describe('UserbookinghistoryComponent', () => {
  let component: UserbookinghistoryComponent;
  let fixture: ComponentFixture<UserbookinghistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserbookinghistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserbookinghistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
