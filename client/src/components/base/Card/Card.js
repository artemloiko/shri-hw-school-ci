import React from 'react';
import PropTypes from 'prop-types';

import './Card.css';

function Card({ href, children }) {
  return (
    <a href={href} className="card">
      {children}
    </a>
  );
}

Card.propTypes = {
  href: PropTypes.string,
  children: PropTypes.any,
};

export default Card;
