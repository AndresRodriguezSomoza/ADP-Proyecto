import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditarFooter } from "./editar-footer";

describe("EditarFooter", () => {
  let component: EditarFooter;
  let fixture: ComponentFixture<EditarFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
