import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessnotificationComponent } from './businessnotification.component';

describe('BusinessnotificationComponent', () => {
  let component: BusinessnotificationComponent;
  let fixture: ComponentFixture<BusinessnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessnotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
