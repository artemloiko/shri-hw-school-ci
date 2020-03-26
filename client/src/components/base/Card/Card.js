import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

import './Card.css';

function Card({ to = '', children }) {
  return (
    <Link to={to} className="card">
      {children}
    </Link>
  );
}

Card.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any,
};

export default Card;
