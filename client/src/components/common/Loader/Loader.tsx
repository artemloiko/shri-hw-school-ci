import React, { ReactNode } from 'react';
import { cn, CNProps } from '../../../utils/bem-cn';

import './Loader.css';

type LoaderMods = {
  static?: boolean;
  animate?: boolean;
};

type Props = {
  children?: ReactNode;
  isLoading: boolean;
  showContent?: boolean;
};

type LoaderProps = Props & CNProps<LoaderMods> & React.HTMLAttributes<HTMLDivElement>;

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
