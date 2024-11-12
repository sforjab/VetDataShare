import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaDetalleComponent } from './prueba-detalle.component';

describe('PruebaDetalleComponent', () => {
  let component: PruebaDetalleComponent;
  let fixture: ComponentFixture<PruebaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebaDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
