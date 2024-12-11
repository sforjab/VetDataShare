import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaClinicaComponent } from './baja-clinica.component';

describe('BajaClinicaComponent', () => {
  let component: BajaClinicaComponent;
  let fixture: ComponentFixture<BajaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaClinicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
