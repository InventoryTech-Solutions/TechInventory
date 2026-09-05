import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInventarioComponent } from './gestion-inventario';

describe('GestionInventario', () => {
  let component: GestionInventarioComponent;
  let fixture: ComponentFixture<GestionInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionInventarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionInventarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
