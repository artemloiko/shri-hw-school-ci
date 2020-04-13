module.exports = {
  root: '.page',
  header: '.header__heading',
  loader: '.page__content .loader',
  errorModal: '.error-modal',

  home: {
    runBuild: '.button[type=button].header__control',
    getStarted: '.get-started',
    getStartedButton: '.get-started__button',
    history: '.build-history',
    historyCard: '.build-history__card',
  },
  buildModal: {
    block: '.build-modal',
    submit: '.build-modal .button_action.button[type=submit]',
    cancel: '.build-modal .button[type=button]',
    input: 'input#commitHash',
    loader: '.build-modal .loader',
  },
  settings: {
    block: '.settings',
    form: '.form',
  },
  details: {
    block: '.details',
    commitHash: '.details .card-ci-run__commit-info-elem .icon-text__secondary-text',
  },
};
