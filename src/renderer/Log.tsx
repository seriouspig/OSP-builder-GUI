import { useEffect, useState } from 'react';
import ElementMaker from './ElementMaker';

const Log = (props) => {
  
  const [editLog, setEditLog] = useState(false);
  const [logNameEdit, setLogNameEdit] = useState('')

  useEffect(() => {
    setLogNameEdit(props.logName)
  }, [props.logName])

  return (
    <div className="info-module">
      <div className="header">LOG OUTPUT</div>
      <div className="info tags">
        <div className="info-text">
          <div>Log file name:</div>
          <ElementMaker
            className="tags-button"
            value={logNameEdit}
            showInputEle={editLog}
            handleDoubleClick={() => setEditLog(true)}
            handleChange={(e) => setLogNameEdit(e.target.value)}
            handleBlur={() => {
              props.saveLogName(logNameEdit);
              setEditLog(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Log;
