import { FilterbyemployeeModule } from './filterbyemployee.module';

describe('FilterbyemployeeModule', () => {
  let filterbyemployeeModule: FilterbyemployeeModule;

  beforeEach(() => {
    filterbyemployeeModule = new FilterbyemployeeModule();
  });

  it('should create an instance', () => {
    expect(filterbyemployeeModule).toBeTruthy();
  });
});
