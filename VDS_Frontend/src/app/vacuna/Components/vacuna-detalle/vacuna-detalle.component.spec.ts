import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunaDetalleComponent } from './vacuna-detalle.component';

describe('VacunaDetalleComponent', () => {
  let component: VacunaDetalleComponent;
  let fixture: ComponentFixture<VacunaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacunaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
