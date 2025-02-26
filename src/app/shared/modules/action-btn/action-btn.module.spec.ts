import { ActionBtnModule } from './action-btn.module';

describe('ActionBtnModule', () => {
  let actionBtnModule: ActionBtnModule;

  beforeEach(() => {
    actionBtnModule = new ActionBtnModule();
  });

  it('should create an instance', () => {
    expect(actionBtnModule).toBeTruthy();
  });
});
