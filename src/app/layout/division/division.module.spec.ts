import { DivisionModule } from './division.module';

describe('DivisionModule', () => {
  let divisionModule: DivisionModule;

  beforeEach(() => {
    divisionModule = new DivisionModule();
  });

  it('should create an instance', () => {
    expect(divisionModule).toBeTruthy();
  });
});
