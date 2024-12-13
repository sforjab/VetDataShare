import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidarPasswordComponent } from './olvidar-password.component';

describe('OlvidarPasswordComponent', () => {
  let component: OlvidarPasswordComponent;
  let fixture: ComponentFixture<OlvidarPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlvidarPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlvidarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
