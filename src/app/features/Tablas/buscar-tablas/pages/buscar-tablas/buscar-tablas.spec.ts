import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarTablas } from './buscar-tablas';

describe('BuscarTablas', () => {
  let component: BuscarTablas;
  let fixture: ComponentFixture<BuscarTablas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarTablas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarTablas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
