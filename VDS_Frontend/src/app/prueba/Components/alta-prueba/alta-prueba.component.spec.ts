import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPruebaComponent } from './alta-prueba.component';

describe('AltaPruebaComponent', () => {
  let component: AltaPruebaComponent;
  let fixture: ComponentFixture<AltaPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaPruebaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
