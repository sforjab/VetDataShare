import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaVacunasListComponent } from './mascota-vacunas-list.component';

describe('MascotaVacunasListComponent', () => {
  let component: MascotaVacunasListComponent;
  let fixture: ComponentFixture<MascotaVacunasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MascotaVacunasListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaVacunasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
