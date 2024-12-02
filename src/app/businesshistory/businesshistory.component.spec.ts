import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesshistoryComponent } from './businesshistory.component';

describe('BusinesshistoryComponent', () => {
  let component: BusinesshistoryComponent;
  let fixture: ComponentFixture<BusinesshistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinesshistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinesshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
