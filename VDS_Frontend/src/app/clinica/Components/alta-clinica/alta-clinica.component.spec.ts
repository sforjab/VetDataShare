import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaClinicaComponent } from './alta-clinica.component';

describe('AltaClinicaComponent', () => {
  let component: AltaClinicaComponent;
  let fixture: ComponentFixture<AltaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaClinicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
