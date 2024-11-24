import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicaDashboardComponent } from './clinica-dashboard.component';

describe('ClinicaDashboardComponent', () => {
  let component: ClinicaDashboardComponent;
  let fixture: ComponentFixture<ClinicaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
