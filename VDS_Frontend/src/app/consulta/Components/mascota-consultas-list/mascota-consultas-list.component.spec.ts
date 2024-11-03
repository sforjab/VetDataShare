import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaConsultasListComponent } from './mascota-consultas-list.component';

describe('MascotaConsultasListComponent', () => {
  let component: MascotaConsultasListComponent;
  let fixture: ComponentFixture<MascotaConsultasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MascotaConsultasListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaConsultasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
