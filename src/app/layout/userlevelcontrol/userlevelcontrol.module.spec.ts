import { UserlevelcontrolModule } from './userlevelcontrol.module';

describe('UserlevelcontrolModule', () => {
  let userlevelcontrolModule: UserlevelcontrolModule;

  beforeEach(() => {
    userlevelcontrolModule = new UserlevelcontrolModule();
  });

  it('should create an instance', () => {
    expect(userlevelcontrolModule).toBeTruthy();
  });
});
