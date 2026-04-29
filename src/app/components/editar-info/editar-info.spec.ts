import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInfo } from './editar-info';

describe('EditarInfo', () => {
  let component: EditarInfo;
  let fixture: ComponentFixture<EditarInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
