import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

import './Header.css';

function Header(props) {
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
}

Header.propTypes = {
  text: PropTypes.string,
  controls: PropTypes.element,
};

export default Header;
