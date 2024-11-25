import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaMascotaComponent } from './baja-mascota.component';

describe('BajaMascotaComponent', () => {
  let component: BajaMascotaComponent;
  let fixture: ComponentFixture<BajaMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaMascotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaMascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
