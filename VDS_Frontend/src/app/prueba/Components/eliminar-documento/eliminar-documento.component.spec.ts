import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarDocumentoComponent } from './eliminar-documento.component';

describe('EliminarDocumentoComponent', () => {
  let component: EliminarDocumentoComponent;
  let fixture: ComponentFixture<EliminarDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
