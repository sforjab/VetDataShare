import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoRestringidoComponent } from './acceso-restringido.component';

describe('AccesoRestringidoComponent', () => {
  let component: AccesoRestringidoComponent;
  let fixture: ComponentFixture<AccesoRestringidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesoRestringidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoRestringidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
