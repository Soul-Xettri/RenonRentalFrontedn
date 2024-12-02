import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicinfoComponent } from './basicinfo.component';

describe('BasicinfoComponent', () => {
  let component: BasicinfoComponent;
  let fixture: ComponentFixture<BasicinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicinfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
