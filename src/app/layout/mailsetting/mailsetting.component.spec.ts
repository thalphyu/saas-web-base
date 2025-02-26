import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailsettingComponent } from './mailsetting.component';

describe('MailsettingComponent', () => {
  let component: MailsettingComponent;
  let fixture: ComponentFixture<MailsettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MailsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
