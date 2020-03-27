import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

import './Header.css';

function Header(props) {
  const { text, controls } = props;

  return (
    <header className="header">
      <div className="container header__container">
        {text ? (
          <h1 className="header__heading">
            <span className="typography__headline2">{text}</span>
          </h1>
        ) : (
          <h1 className="header__heading">
            <Link to="/" className="typography__headline1">
              School CI server
            </Link>
          </h1>
        )}

        <div className="header__control-group">{controls}</div>
      </div>
    </header>
  );
}

Header.propTypes = {
  text: PropTypes.string,
  controls: PropTypes.element,
};

export default Header;
