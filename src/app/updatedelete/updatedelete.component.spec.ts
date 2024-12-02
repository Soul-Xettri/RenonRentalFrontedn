import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedeleteComponent } from './updatedelete.component';

describe('UpdatedeleteComponent', () => {
  let component: UpdatedeleteComponent;
  let fixture: ComponentFixture<UpdatedeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatedeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
