import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registradores } from './registradores';

describe('Registradores', () => {
  let component: Registradores;
  let fixture: ComponentFixture<Registradores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registradores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registradores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
