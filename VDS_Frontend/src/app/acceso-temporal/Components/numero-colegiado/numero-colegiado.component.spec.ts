import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeroColegiadoComponent } from './numero-colegiado.component';

describe('NumeroColegiadoComponent', () => {
  let component: NumeroColegiadoComponent;
  let fixture: ComponentFixture<NumeroColegiadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumeroColegiadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumeroColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
