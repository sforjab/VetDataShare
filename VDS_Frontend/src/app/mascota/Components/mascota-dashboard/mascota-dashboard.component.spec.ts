import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaDashboardComponent } from './mascota-dashboard.component';

describe('MascotaDashboardComponent', () => {
  let component: MascotaDashboardComponent;
  let fixture: ComponentFixture<MascotaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MascotaDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
