const config = require('config');
const expect = require('chai').expect;
const storage = require('../utils/storage');

const page = require('../utils/pageObject');
const { home, settings, buildModal, details } = page;

const url = config.get('client.urls');

describe('Home page without settings', function() {
  beforeEach(function(done) {
    storage.deleteSettings().then(done);
  });

  beforeEach(function() {
    return this.browser.url(url.root).waitForExist(home.getStarted);
  });

  it('Header should have default value', function() {
    return this.browser.getText(page.header).then(function(title) {
      expect(title, 'Page title').to.equal('School CI server');
    });
  });

  it('Get started block should be shown', function() {
    return this.browser.assertExist(home.getStarted);
  });

  it('Get started block button should open settings', function() {
    return this.browser
      .click(home.getStartedButton)
      .waitForExist(settings.block)
      .getUrl()
      .then(function(v) {
        expect(v).to.equal(url.settings);
      });
  });
});

describe('Home page with specified settings', function() {
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
  beforeEach(function() {
    return this.browser.url(url.root).waitForExist(home.history, 3000);
  });

  it('Header should contain repository name', function() {
    return this.browser.getText(page.header).then(function(title) {
      expect(title, 'Page title').to.equal(ciSettings.repoName);
    });
  });

  it('History block should be shown', function() {
    return this.browser.assertExist(home.history, "History block doesn't exist");
  });

  it('History block should be empty', function() {
    return this.browser.assertNotExist(home.historyCard, 'History card exists');
  });
});

describe('Home page build modal', () => {
  beforeEach(function() {
    return this.browser.url(url.root).waitForExist(home.history, 3000);
  });

  it('Run build button should exist', function() {
    return this.browser.assertExist(home.runBuild, "Run build button doesn't exist");
  });

  describe('Build modal', function() {
    beforeEach(function() {
      return this.browser.click(home.runBuild).waitForVisible(buildModal.block);
    });

    it('Build modal should be opened on run build click', function() {
      return this.browser.assertExist(buildModal.block, "Modal doesn't exist");
    });

    it('Build modal should be closed on run cancel click', function() {
      return this.browser
        .click(buildModal.cancel)
        .waitForVisible(buildModal.block, 1000, true)
        .assertNotExist(buildModal.block, "Modal doesn't hide");
    });

    it('Cannot send empty build form', function() {
      return this.browser
        .click(buildModal.submit)
        .assertEnabled(buildModal.submit)
        .assertNotExist(buildModal.loader, 'Loader should not be shown');
    });

    it('Cannot send invalid commits', function() {
      return this.browser
        .setValue(buildModal.input, 'a0')
        .click(buildModal.submit)
        .assertEnabled(buildModal.submit, 'Submit button is enabled')
        .assertNotExist(buildModal.loader, 'Loader should not be shown')
        .clearElement(buildModal.input)
        .setValue(buildModal.input, 'ha')
        .click(buildModal.submit)
        .assertEnabled(buildModal.submit, 'Submit button is enabled')
        .assertNotExist(buildModal.loader, 'Loader should not be shown');
    });

    it('Error is shown if wrong commit was sent', function() {
      return this.browser
        .setValue(buildModal.input, 'ababab')
        .click(buildModal.submit)
        .waitForExist(page.errorModal)
        .assertExist(page.errorModal)
        .click(page.errorModalCloseButton);
    });

    it('Should redirect on build details if correct commit was sent', function() {
      return this.browser
        .setValue(buildModal.input, 'a63f2b3')
        .click(buildModal.submit)
        .assertDisabled(buildModal.submit, 'Button should be disabled while sending')
        .assertExist(buildModal.loader, 'Loader should be shown')
        .waitForExist(details.block)
        .assertExist(details.block, 'Details should be shown')
        .getText(details.commitHash)
        .then((v) => {
          expect(v).to.equal('a63f2b3', 'Should be shown the same commit');
        });
    });
  });
});
