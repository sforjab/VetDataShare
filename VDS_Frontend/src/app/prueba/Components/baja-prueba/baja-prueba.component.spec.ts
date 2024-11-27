import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaPruebaComponent } from './baja-prueba.component';

describe('BajaPruebaComponent', () => {
  let component: BajaPruebaComponent;
  let fixture: ComponentFixture<BajaPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaPruebaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
