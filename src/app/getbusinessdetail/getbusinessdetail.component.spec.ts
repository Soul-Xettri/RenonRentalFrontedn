import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetbusinessdetailComponent } from './getbusinessdetail.component';

describe('GetbusinessdetailComponent', () => {
  let component: GetbusinessdetailComponent;
  let fixture: ComponentFixture<GetbusinessdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetbusinessdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetbusinessdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
