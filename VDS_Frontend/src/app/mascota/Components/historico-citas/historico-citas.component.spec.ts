import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCitasComponent } from './historico-citas.component';

describe('HistoricoCitasComponent', () => {
  let component: HistoricoCitasComponent;
  let fixture: ComponentFixture<HistoricoCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoCitasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
