import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaVacunaComponent } from './alta-vacuna.component';

describe('AltaVacunaComponent', () => {
  let component: AltaVacunaComponent;
  let fixture: ComponentFixture<AltaVacunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaVacunaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaVacunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
