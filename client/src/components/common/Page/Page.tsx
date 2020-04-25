import React, { ReactElement } from 'react';
import clsx from 'clsx';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';

import './Page.css';

type Elements = ReactElement | ReactElement[];

export interface PageProps {
  children: Elements;
  headerControls?: Elements;
  contentClass?: string;
  headerText?: string;
}

const Page: React.FC<PageProps> = ({ children, contentClass, headerControls, headerText }) => {
  return (
    <div className="typography page">
      <Header controls={headerControls} text={headerText} />
      <div className={clsx('page__content', contentClass)}>{children}</div>
      <Footer />
    </div>
  );
};

export default Page;
