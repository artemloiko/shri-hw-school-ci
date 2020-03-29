import React from 'react';
import PropTypes from 'prop-types';

import './Log.css';

const Convert = require('ansi-to-html');
const ansiConverter = new Convert({ fg: '#000', bg: '#000' });

function Log(props) {
  const { children, log = '' } = props;
  return (
    <div className="log">
      {log ? (
        <pre
          className="log__pre"
          dangerouslySetInnerHTML={{ __html: ansiConverter.toHtml(log) }}
        ></pre>
      ) : (
        <pre className="log__pre">{children}</pre>
      )}
    </div>
  );
}

Log.propTypes = {
  children: PropTypes.any,
  log: PropTypes.string,
};

export default Log;
