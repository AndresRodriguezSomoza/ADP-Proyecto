import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OfertaAcademica } from "./oferta-academica";

describe("OfertaAcademica", () => {
  let component: OfertaAcademica;
  let fixture: ComponentFixture<OfertaAcademica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaAcademica],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertaAcademica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
