import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterbyemployeemultiComponent } from './filterbyemployeemulti.component';

describe('FilterbyemployeemultiComponent', () => {
  let component: FilterbyemployeemultiComponent;
  let fixture: ComponentFixture<FilterbyemployeemultiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterbyemployeemultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterbyemployeemultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
