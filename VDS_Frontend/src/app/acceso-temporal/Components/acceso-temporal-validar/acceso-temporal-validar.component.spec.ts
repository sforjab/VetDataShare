import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoTemporalValidarComponent } from './acceso-temporal-validar.component';

describe('AccesoTemporalValidarComponent', () => {
  let component: AccesoTemporalValidarComponent;
  let fixture: ComponentFixture<AccesoTemporalValidarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesoTemporalValidarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoTemporalValidarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
