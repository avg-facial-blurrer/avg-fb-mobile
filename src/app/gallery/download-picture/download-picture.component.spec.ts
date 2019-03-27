import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPictureComponent } from './download-picture.component';

describe('DownloadPictureComponent', () => {
  let component: DownloadPictureComponent;
  let fixture: ComponentFixture<DownloadPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
