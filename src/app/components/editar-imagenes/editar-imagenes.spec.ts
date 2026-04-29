import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditarImagenes } from "./editar-imagenes";

describe("EditarImagenes", () => {
  let component: EditarImagenes;
  let fixture: ComponentFixture<EditarImagenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarImagenes],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarImagenes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
