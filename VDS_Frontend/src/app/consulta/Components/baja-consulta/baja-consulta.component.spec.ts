import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaConsultaComponent } from './baja-consulta.component';

describe('BajaConsultaComponent', () => {
  let component: BajaConsultaComponent;
  let fixture: ComponentFixture<BajaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
