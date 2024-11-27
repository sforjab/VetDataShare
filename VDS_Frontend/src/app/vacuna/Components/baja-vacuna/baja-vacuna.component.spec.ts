import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaVacunaComponent } from './baja-vacuna.component';

describe('BajaVacunaComponent', () => {
  let component: BajaVacunaComponent;
  let fixture: ComponentFixture<BajaVacunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaVacunaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaVacunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
