import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermsAndConditionComponent } from './terms-and-condition.component';

describe('TermsAndConditionComponent', () => {
  let component: TermsAndConditionComponent;
  let fixture: ComponentFixture<TermsAndConditionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
