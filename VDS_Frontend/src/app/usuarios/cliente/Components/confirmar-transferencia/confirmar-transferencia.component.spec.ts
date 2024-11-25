import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarTransferenciaComponent } from './confirmar-transferencia.component';

describe('ConfirmarTransferenciaComponent', () => {
  let component: ConfirmarTransferenciaComponent;
  let fixture: ComponentFixture<ConfirmarTransferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarTransferenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
