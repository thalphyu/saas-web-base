import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnouncemantComponent } from './announcemant.component';

describe('AnnouncemantComponent', () => {
  let component: AnnouncemantComponent;
  let fixture: ComponentFixture<AnnouncemantComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncemantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncemantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
