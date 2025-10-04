import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposRegistradores } from './tipos-registradores';

describe('TiposRegistradores', () => {
  let component: TiposRegistradores;
  let fixture: ComponentFixture<TiposRegistradores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposRegistradores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposRegistradores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
