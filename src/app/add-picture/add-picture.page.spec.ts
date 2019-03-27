import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPicturePage } from './add-picture.page';

describe('AddPicturePage', () => {
  let component: AddPicturePage;
  let fixture: ComponentFixture<AddPicturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPicturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPicturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
