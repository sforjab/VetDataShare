import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosClinicaComponent } from './datos-clinica.component';

describe('DatosClinicaComponent', () => {
  let component: DatosClinicaComponent;
  let fixture: ComponentFixture<DatosClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosClinicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
