import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import Footer from 'components/common/Footer/Footer';
import Header from 'components/common/Header/Header';

import './Page.css';

function Page({ children, contentClass }) {
  return (
      <div className="typography page">
        <Header />
        <div className={clsx('page__content', contentClass)}>{children}</div>
        <Footer />
      </div>
  );
}

Page.propTypes = {
  children: PropTypes.any.isRequired,
  contentClass: PropTypes.string,
};

export default Page;
