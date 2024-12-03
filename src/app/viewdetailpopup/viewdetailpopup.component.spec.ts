import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdetailpopupComponent } from './viewdetailpopup.component';

describe('ViewdetailpopupComponent', () => {
  let component: ViewdetailpopupComponent;
  let fixture: ComponentFixture<ViewdetailpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewdetailpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewdetailpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
