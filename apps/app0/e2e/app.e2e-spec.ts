import { AppPage } from './app.po';

describe('Ingests App (app0)', () => { 
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

 // Check title in navigation :

  it('should display title "Numérisation" to path "/"', () => {
    page.navigateToHome();
    expect(page.getPageTitle()).toEqual('Numérisation');
  });

  it('should display title "Numérisation" to path "ingests/tables-view"', () => {
    page.navigateToHomeTable();
    expect(page.getPageTitle()).toEqual('Numérisation');
  });

  it('should display title "Fichiers en cours de traitement" to path "ingests/in-progress"', () => {
    page.navToIngestsInProgress();
    expect(page.getPageTitle()).toEqual('Fichiers en cours de traitement');
  });

  it('should display title "Fichiers Terminés" to path "ingests/completed"', () => {
    page.navToIngestsCompleted();
    expect(page.getPageTitle()).toEqual('Fichiers Terminés');
  });

  it('should display title "En attente KAI" to path "ingests/kai-waiting"', () => {
    page.navToKaiWaiting();
    expect(page.getPageTitle()).toEqual('Numérisation KAI');
  });

  it('should display title "En attente KARINA" to path "ingests/karina-waiting"', () => {
    page.navToKarinaWaiting();
    expect(page.getPageTitle()).toEqual('En attente KARINA');
  });

  it('should display title "Publicité" to path "publicity"', () => {
    page.navigateToPub();
    expect(page.getPageTitle()).toEqual('Publicité');
  });

  it('should display title "Publicité" to path "publicity/tables-view"', () => {
    page.navigateToPubTable();
    expect(page.getPageTitle()).toEqual('Publicité');
  });

  it('should display title "Publicités en cours de traitement" to path "publicity/in-progress"', () => {
    page.navToPubInProgress();
    expect(page.getPageTitle()).toEqual('Publicités en cours de traitement');
  });

  it('should display title "Publicités Terminés" to path "publicity/completed"', () => {
    page.navToPubCompleted();
    expect(page.getPageTitle()).toEqual('Publicités Terminés');
  });

  it('should display title "Fichiers purgés" to path "purged"', () => {
    page.navigateToPurged();
    expect(page.getPageTitle()).toEqual('Fichiers purgés');
  });

});
