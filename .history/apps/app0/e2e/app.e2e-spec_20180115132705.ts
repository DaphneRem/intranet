import { AppPage } from './app.po';

describe('ng-nx-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display app0 tilte', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('pp0');
  });
});
