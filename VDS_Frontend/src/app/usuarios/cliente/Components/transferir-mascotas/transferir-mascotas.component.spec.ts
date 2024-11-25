import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferirMascotasComponent } from './transferir-mascotas.component';

describe('TransferirMascotasComponent', () => {
  let component: TransferirMascotasComponent;
  let fixture: ComponentFixture<TransferirMascotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferirMascotasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferirMascotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
