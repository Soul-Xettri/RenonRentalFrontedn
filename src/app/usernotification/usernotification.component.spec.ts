import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernotificationComponent } from './usernotification.component';

describe('UsernotificationComponent', () => {
  let component: UsernotificationComponent;
  let fixture: ComponentFixture<UsernotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsernotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
