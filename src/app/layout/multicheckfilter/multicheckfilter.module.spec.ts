import { MulticheckfilterModule } from './multicheckfilter.module';

describe('MulticheckfilterModule', () => {
  let multicheckfilterModule: MulticheckfilterModule;

  beforeEach(() => {
    multicheckfilterModule = new MulticheckfilterModule();
  });

  it('should create an instance', () => {
    expect(multicheckfilterModule).toBeTruthy();
  });
});
