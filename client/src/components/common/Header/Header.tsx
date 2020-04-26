import React, { ReactElement } from 'react';
import { Link } from '@reach/router';

import './Header.css';

type HeaderProps = {
  text?: string;
  controls?: ReactElement | ReactElement[];
};

const Header: React.FC<HeaderProps> = (props) => {
  const { text, controls } = props;

  return (
    <header className="header">
      <div className="container header__container">
        <h1 className="header__heading">
          <Link to="/" className={text ? 'typography__headline2' : 'typography__headline1'}>
            {text || 'School CI server'}
          </Link>
        </h1>
        <div className="header__control-group">{controls}</div>
      </div>
    </header>
  );
};

export default Header;
