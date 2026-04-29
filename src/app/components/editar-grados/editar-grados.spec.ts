import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditarGrados } from "./editar-grados";

describe("EditarGrados", () => {
  let component: EditarGrados;
  let fixture: ComponentFixture<EditarGrados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarGrados],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarGrados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
