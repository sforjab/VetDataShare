import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaPruebasListComponent } from './mascota-pruebas-list.component';

describe('MascotaPruebasListComponent', () => {
  let component: MascotaPruebasListComponent;
  let fixture: ComponentFixture<MascotaPruebasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MascotaPruebasListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaPruebasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
