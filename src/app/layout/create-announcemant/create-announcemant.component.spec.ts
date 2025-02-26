import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateAnnouncemantComponent } from './create-announcemant.component';

describe('CreateAnnouncemantComponent', () => {
  let component: CreateAnnouncemantComponent;
  let fixture: ComponentFixture<CreateAnnouncemantComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAnnouncemantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnnouncemantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
