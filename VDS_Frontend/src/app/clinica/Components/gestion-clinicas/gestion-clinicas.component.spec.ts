import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionClinicasComponent } from './gestion-clinicas.component';

describe('GestionClinicasComponent', () => {
  let component: GestionClinicasComponent;
  let fixture: ComponentFixture<GestionClinicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionClinicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionClinicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
