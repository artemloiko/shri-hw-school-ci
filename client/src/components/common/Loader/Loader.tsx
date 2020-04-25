import React, { ReactElement } from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import './Loader.css';

type LoaderMods = {
  static?: boolean;
  animate?: boolean;
};

export type LoaderProps = {
  children: ReactElement | ReactElement[];
  isLoading: boolean;
  showContent?: boolean;
} & CNProps<LoaderMods> &
  React.HTMLProps<HTMLDivElement>;

const Loader: React.FC<LoaderProps> = (props) => {
  const { children, isLoading, showContent, ...loaderProps } = props;
  return (
    <>
      {isLoading && (
        <div {...loaderProps} className={cn('loader', props)}>
          <div className="cat">
            <div className="cat__body"></div>
            <div className="cat__body"></div>
            <div className="cat__tail"></div>
            <div className="cat__head"></div>
          </div>
        </div>
      )}
      {isLoading && !showContent ? null : children}
    </>
  );
};

export default Loader;
