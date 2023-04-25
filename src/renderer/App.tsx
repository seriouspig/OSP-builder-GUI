import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Tags from './Tags';
import Config from './Config';
import { use } from 'matter';

function Hello() {
  const [tags, setTags] = useState({});
  const [config, setConfig] = useState({});
  const [configLoaded, setConfigLoaded] = useState(false);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [state, setState] = useState('config');
  const [log, setLog] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-tags');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-config');
  }, []);

  window.electron.ipcRenderer.once('get-tags', (arg) => {
    setTags(arg);
    console.log('Here are the tags:');
    console.log(arg);
    setTagsLoaded(true);
  });

  window.electron.ipcRenderer.once('get-config', (arg) => {
    setConfig(arg);
    console.log('Here is the config:');
    console.log(arg);
    setConfigLoaded(true);
  });

  const updateConfig = () => {
    console.log('------ Config Updated ------');
    // window.electron.ipcRenderer.sendMessage('set-integration', 'DUUUPPPPAAAA');
  };

  const toggleBuild = () => {
    if (state === 'config') {
      setLog('');
      window.electron.ipcRenderer.sendMessage('run-script');
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

  return (
    <div className="container">
      <div className="title">OSP BUILDER</div>
      {state === 'config' && (
        <div className="info-container">
          {tagsLoaded && <Tags tags={tags} />}
          {configLoaded && (
            <Config config={config} updateConfig={updateConfig} />
          )}
          <button onClick={toggleBuild}>Build</button>
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
