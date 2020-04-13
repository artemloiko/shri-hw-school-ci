const config = require('config');
const expect = require('chai').expect;
const page = require('../utils/pageObject');
const storage = require('../../server/src/models/storage');

const url = config.get('client.urls');

describe('Home page without settings', function() {
  beforeEach(function(done) {
    storage.deleteSettings().then(done);
  });

  it('should find header', function() {
    return this.browser
      .url(url.root)
      .getText(page.header)
      .then(function(title) {
        expect(title, 'Page title').to.equal('School CI server');
      });
  });

  it('should find getStarted block', function() {
    return this.browser
      .url(url.root)
      .waitForExist(page.home.getStarted)
      .then(function(v) {
        expect(v).to.be.true;
      });
  });

  it('getStarted block button should open settings', function() {
    return this.browser
      .url(url.root)
      .click(page.home.getStartedButton)
      .waitForExist(page.settings.settingsBlock)
      .getUrl()
      .then(function(v) {
        expect(v).to.equal(url.settings);
      });
  });
});

describe('Home page with settings', function() {
  const ciSettings = {
    id: 'c42db8b8-128a-4194-a19b-7974cabccf4f',
    repoName: 'artuom130/shri-hw-async',
    buildCommand: 'npm run build',
    mainBranch: 'master',
    period: 0,
  };
  beforeEach(function(done) {
    storage.setSettings(ciSettings).then(done);
  });

  it('should find header', function() {
    return this.browser
      .url(url.root)
      .getText(page.header)
      .then(function(title) {
        expect(title, 'Page title').to.equal(ciSettings.repoName);
      });
  });

  it('should find history block', function() {
    return this.browser
      .url(url.root)
      .waitForExist(page.home.history)
      .then(function(v) {
        expect(v).to.be.true;
      });
  });

  it('history should be empty', function() {
    return this.browser
      .url(url.root)
      .waitForExist(page.home.history)
      .isExisting(page.home.historyCard)
      .then(function(v) {
        expect(v).to.be.false;
      });
  });
});
