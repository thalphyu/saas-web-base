import { TreeviewModule } from './treeview.module';

describe('TreeviewModule', () => {
  let treeviewModule: TreeviewModule;

  beforeEach(() => {
    treeviewModule = new TreeviewModule();
  });

  it('should create an instance', () => {
    expect(treeviewModule).toBeTruthy();
  });
});
