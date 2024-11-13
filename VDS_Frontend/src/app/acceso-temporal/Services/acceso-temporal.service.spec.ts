import { TestBed } from '@angular/core/testing';

import { AccesoTemporalService } from './acceso-temporal.service';

describe('AccesoTemporalService', () => {
  let service: AccesoTemporalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesoTemporalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
