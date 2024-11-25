import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaClienteComponent } from './baja-cliente.component';

describe('BajaClienteComponent', () => {
  let component: BajaClienteComponent;
  let fixture: ComponentFixture<BajaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
