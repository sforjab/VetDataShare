import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoTemporalGenerarComponent } from './acceso-temporal-generar.component';

describe('AccesoTemporalGenerarComponent', () => {
  let component: AccesoTemporalGenerarComponent;
  let fixture: ComponentFixture<AccesoTemporalGenerarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesoTemporalGenerarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoTemporalGenerarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
