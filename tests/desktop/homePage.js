const config = require('config');
const assert = require('chai').assert;
const home = require('../pageObjects/homePage');
// const storage = require('../../server/src/models/storage');

const url = config.get('urls.client');

describe('Page loaded without settings', function() {
  // beforeEach(function(done) {
  //   storage.deleteSettings().then(done);
  // });
  console.log('urls', url, process.env.NODE_ENV);

  it('should find header', function() {
    return this.browser
      .url(url.root)
      .getText(home.header)
      .then(function(title) {
        console.log('title', title);
        assert.equal(title, 'School CI server');
      });
  });

  it('should find getStarted block', function() {
    return this.browser
      .url(url.root)
      .isExisting(home.getStarted)
      .then(function(v) {
        assert.isTrue(v, 'GetStarted exists');
      });
  });
});
