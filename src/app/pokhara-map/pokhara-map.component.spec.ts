import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokharaMapComponent } from './pokhara-map.component';

describe('PokharaMapComponent', () => {
  let component: PokharaMapComponent;
  let fixture: ComponentFixture<PokharaMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokharaMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokharaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
