import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Tags from './Tags';
import Config from './Config';
import Settings from './Settings';
import Log from './Log';

function Hello() {
  const [tags, setTags] = useState({});
  const [config, setConfig] = useState({});
  const [configLoaded, setConfigLoaded] = useState(false);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [state, setState] = useState('config');
  const [log, setLog] = useState('');
  const [builderPath, setBuilderPath] = useState('');
  const [logName, setLogName] = useState('Log name ...');
  

  useEffect(() => {
    console.log('State Changed');
    window.electron.ipcRenderer.sendMessage('get-builder-path');
    window.electron.ipcRenderer.sendMessage('get-tags');
    window.electron.ipcRenderer.sendMessage('get-config');
  }, [state]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-tags');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-config');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-builder-path');
  }, []);

  window.electron.ipcRenderer.once('get-tags', (arg) => {
    if (arg !== 'no tags') {
      setTags(arg);
      setTagsLoaded(true);
    } else {
      console.log('Here are the tags:');
      console.log(arg);
      setTagsLoaded(false);
    }
  });

  window.electron.ipcRenderer.once('get-config', (arg) => {
    if (arg !== 'no config') {
      setConfig(arg);
      console.log('Here is the config:');
      console.log(arg);
      setConfigLoaded(true);
    } else {
      console.log('Here is the config:');
      console.log(arg);
      setConfigLoaded(false);
    }
  });

  window.electron.ipcRenderer.once('get-builder-path', (arg) => {
    console.log('--------builder path---------');
    console.log(arg);
    setBuilderPath(arg);
  });

  const toggleBuild = () => {
    if (state === 'config') {
      setLog('');
      window.electron.ipcRenderer.sendMessage('run-script', logName);
      setState('build');
    } else if (state === 'build') {
      setState('config');
      window.electron.ipcRenderer.sendMessage('kill-script');
    }
  };

  window.electron.ipcRenderer.on('output', (arg) => {
    console.log('Here is the log:');
    console.log(arg);
    setLog(`${log}${arg}`);
  });

  const handleSelectBuilderPath = () => {
    console.log('=========SHOULD OPEN WINDOW=============');
    window.electron.ipcRenderer.sendMessage('open-dialog-builder-path');
  };

  window.electron.ipcRenderer.on('open-dialog-builder-path', (arg) => {
    setBuilderPath(arg);
  });

  return (
    <div className="container">
      <div className="title">OSP BUILDER</div>
      {state === 'settings' && (
        <Settings
          onClose={() => setState('config')}
          builderPath={builderPath}
          selectBuilderPath={handleSelectBuilderPath}
        />
      )}

      {state === 'config' && (
        <button className="btn-config" onClick={() => setState('settings')}>
          Settings
        </button>
      )}
      {state === 'config' && (
        <div className="info-container">
          <div>{tagsLoaded && <Tags tags={tags} />}
          <Log logName={logName} saveLogName={(name) => setLogName(name)}/>
          </div>
          <div>{configLoaded && <Config config={config} />}</div>
          {(tagsLoaded && configLoaded) && <button onClick={toggleBuild}>Build</button>}
        </div>
      )}
      {state === 'build' && (
        <div className="log-container">
          <div className="display-linebreak">{log}</div>
          <button onClick={toggleBuild}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
