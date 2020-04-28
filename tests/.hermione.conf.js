module.exports = {
  screenshotsDir: 'e2e/screens',
  retry: 4,
  waitTimeout: 2000,

  sets: {
    desktop: {
      files: 'e2e/desktop',
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
      path: 'e2e/hermione-reports',
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
