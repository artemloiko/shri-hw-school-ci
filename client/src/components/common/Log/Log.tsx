import React from 'react';
import Convert from 'ansi-to-html';
import './Log.css';

const ansiConverter = new Convert({ fg: '#000', bg: '#000' });

type LogProps = {
  log?: string;
};

const Log: React.FC<LogProps> = (props) => {
  const { log = '' } = props;
  return (
    <div className="log">
      {log && (
        <pre
          className="log__pre"
          dangerouslySetInnerHTML={{ __html: ansiConverter.toHtml(log) }}
        ></pre>
      )}
    </div>
  );
};

export default Log;
