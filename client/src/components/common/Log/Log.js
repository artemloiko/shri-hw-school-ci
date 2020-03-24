import React from 'react';
import PropTypes from 'prop-types';

import './Log.css';

function Log(props) {
  const { children } = props;
  return (
    <div className="log">
      <pre className="log__pre">{children}</pre>
    </div>
  );
}

Log.propTypes = {
  childre: PropTypes.string,
};

export default Log;
