import { browser, by, element } from 'protractor';

export class AppPage {

  // navigation :

  navigateToHome() {
    return browser.get('/');
  }

  navigateToHomeTable() {
    return browser.get('ingests/tables-view'); 
  }

  navToIngestsInProgress() {
    return browser.get('#/ingests/in-progress');
  }

  navToIngestsCompleted() {
    return browser.get('#/ingests/completed');
  }

  navToKaiWaiting() {
    return browser.get('#/ingests/kai-waiting');
  }

  navToKarinaWaiting() {
    return browser.get('#/ingests/karina-waiting');
  }

  navigateToDetail() {
    return browser.get('#/detail-file');
  }

  navigateToPub() {
    return browser.get('#/publicity');
  }

  navigateToPubTable() {
    return browser.get('#/publicity/tables-view');
  }

  navToPubInProgress() {
    return browser.get('#/publicity/in-progress');
  }

  navToPubCompleted() {
    return browser.get('#/publicity/completed');
  }

  navigateToPurged() {
    return browser.get('#/purged');
  }

  navigateToPlaylists() {
    return browser.get('#/playlists');
  }

  navigateToPlaylistsTable() {
    return browser.get('#/playlists/tables-view');
  }

  navigateToPlaylistsErrors() {
    return browser.get('#/playlists/errors');
  }

  navigateToPlaylistsAll() {
    return browser.get('#/playlists/all');
  }
  // get Title
  getPageTitle() {
    return browser.getTitle();
  }
  // getParagraphText() {
  //   return element(by.css('app-root h1')).getText();
  // }
}
