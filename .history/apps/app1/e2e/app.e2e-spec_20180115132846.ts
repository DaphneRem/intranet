import { AppPage } from './app.po';

describe('app1 App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display app1', () => {
    page.navigateTo();
    expect(page.text()).toContain('App 1');
  });
});
