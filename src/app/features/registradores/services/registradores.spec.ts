import { TestBed } from '@angular/core/testing';

import { Registradores } from './registradores';

describe('Registradores', () => {
  let service: Registradores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Registradores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
