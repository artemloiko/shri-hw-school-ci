import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Footer from 'components/common/Footer/Footer';
import Header from 'components/common/Header/Header';

import './Page.css';

function Page({ children, contentClass, headerControls, headerText }) {
  return (
    <div className="typography page">
      <Header controls={headerControls} text={headerText} />
      <div className={clsx('page__content', contentClass)}>{children}</div>
      <Footer />
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any.isRequired,
  contentClass: PropTypes.string,
  headerControls: PropTypes.element,
  headerText: PropTypes.string,
};

export default Page;
