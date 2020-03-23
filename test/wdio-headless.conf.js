const { config } = require('./wdio.conf.js');

exports.config = {
  ...config,
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['headless', 'disable-gpu'],
      },
    },
  ],
};
