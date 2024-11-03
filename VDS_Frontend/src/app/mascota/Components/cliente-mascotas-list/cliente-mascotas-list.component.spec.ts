import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteMascotasListComponent } from './cliente-mascotas-list.component';

describe('ClienteMascotasListComponent', () => {
  let component: ClienteMascotasListComponent;
  let fixture: ComponentFixture<ClienteMascotasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteMascotasListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteMascotasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
