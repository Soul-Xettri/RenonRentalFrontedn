import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesslistComponent } from './businesslist.component';

describe('BusinesslistComponent', () => {
  let component: BusinesslistComponent;
  let fixture: ComponentFixture<BusinesslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinesslistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinesslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
