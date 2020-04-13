module.exports = {
  screenshotsDir: 'tests/hermione/screens',

  sets: {
    desktop: {
      files: 'tests/desktop',
    },
  },

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
  },

  plugins: {
    'hermione-custom-assert': true,
    'html-reporter/hermione': {
      enabled: true,
      path: 'tests/hermione-reports',
      errorPatterns: [
        'Parameter .* must be a string',
        {
          name: 'Cannot read property of undefined',
          pattern: 'Cannot read property .* of undefined',
          hint: '<div>google it, i dont know how to fix it =(</div>',
        },
      ],
    },
  },
};
