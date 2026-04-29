import { TestBed } from "@angular/core/testing";

import { InfoLocal } from "./info-local";

describe("InfoLocal", () => {
  let service: InfoLocal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoLocal);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
