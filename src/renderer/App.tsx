import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import Tags from './Tags';
import Config from './Config';
import Settings from './Settings';
import Log from './Log';
import DropDown from './DropDown';
import logoImg from './images/logo2.png';
import settingsSvg from './images/settings.svg';
import closeSvg from './images/close.svg';
import Modal from './Modal';

function Gui() {
  const [tags, setTags] = useState({});
  const [config, setConfig] = useState({});
  const [configLoaded, setConfigLoaded] = useState(false);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [state, setState] = useState('config');
  const [log, setLog] = useState('');
  const [builderPath, setBuilderPath] = useState('');
  const [logName, setLogName] = useState('');
  const [tagsImporting, setTagsImporting] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('update-alna', selectedClient.alnaVersion);
  }, [selectedClient])

  useEffect(() => {
    window.electron.ipcRenderer.on('get-clients', (arg) => {
      setClients(arg);
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-clients');
    };
  });

  useEffect(() => {
    setLogName('buildlogs/' + tags.base);
  }, [tags]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-clients');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-tags');
    window.electron.ipcRenderer.sendMessage('get-config');
  }, [builderPath]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-tags');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-config');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-builder-path');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('get-tags', (arg) => {
      setTagsLoaded(false);
      if (arg !== 'no tags') {
        setTags(arg);
        setState('config');
        setTagsImporting(false);
        setTagsLoaded(true);
      } else {
        setTagsLoaded(false);
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-tags');
    };
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('get-config', (arg) => {
      if (arg !== 'no config') {
        setConfig(arg);
        setConfigLoaded(true);
      } else {
        setConfigLoaded(false);
      }
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-config');
    };
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('get-builder-path', (arg) => {
      setBuilderPath(arg);
      window.electron.ipcRenderer.removeAllListeners('get-builder-path');
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-builder-path');
    };
  });

  const toggleBuild = () => {
    if (state === 'config') {
      if (Object.keys(selectedClient).length !== 0) {
        setLog('');
        window.electron.ipcRenderer.sendMessage('run-script', logName);
        setState('build');
      } else {
        setModalMessage("Please select a client")
        setShowModal(true);
      }

    } else if (state === 'build') {
      setState('config');
      window.electron.ipcRenderer.sendMessage('kill-script');
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('output', (arg) => {
      setLog(`${log}${arg}`);
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('output');
    };
  });

  const handleSelectBuilderPath = () => {
    window.electron.ipcRenderer.sendMessage('open-dialog-builder-path');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('open-dialog-builder-path', (arg) => {
      setBuilderPath(arg);
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        'open-dialog-builder-path'
      );
    };
  });

  const backupTags = () => {
    window.electron.ipcRenderer.sendMessage('backup-tags');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('backup-tags', (arg) => {
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('backup-tags');
    };
  });

  const loadTags = () => {
    setTagsImporting(true);
    window.electron.ipcRenderer.sendMessage('load-tags');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('load-tags', (arg) => {
      setState('loading');
      window.electron.ipcRenderer.sendMessage('get-tags');
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('load-tags');
    };
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('run-script', (arg) => {
      setShowModal(true);
      if (arg === 'success') {
        setModalMessage('Build finished successfuly!!!');
      } else if (arg === 'error') {
        setModalMessage('Something went wrong');
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('run-script');
    };
  });

  const selectClient = (id) => {
    for (const client of clients) {
      if (client.id === id) {
        setSelectedClient(client);
        
      }
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(
      'change-gpg-sign',
      selectedClient
    );
  }, [selectedClient]);

  const reloadBase = (base) => {
    setTags((prevState) => ({
      ...prevState, 
      base: base.new, 
    }));
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const scrollToBottom = () => {
    if (messagesEndRef.current !== null) {
      setTimeout(() => messagesEndRef.current.scrollIntoView(), 2000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [log]);

  return (
    <div className="container">
      {showModal && (
        <Modal closeModal={closeModal} modalMessage={modalMessage} />
      )}
      <div className="title">
        <div>
          <img src={logoImg} alt="" />
        </div>
        <div className="title-text">OSP BUILDER</div>
        {state === 'config' && (
          <button className="btn-config" onClick={() => setState('settings')}>
            <img src={settingsSvg} alt="" />
          </button>
        )}
        {state === 'settings' && (
          <button className="btn-config" onClick={() => setState('config')}>
            <img src={closeSvg} alt="" />
          </button>
        )}
      </div>

      {state === 'settings' && (
        <Settings
          onClose={() => setState('config')}
          builderPath={builderPath}
          selectBuilderPath={handleSelectBuilderPath}
        />
      )}

      {state === 'config' && tagsLoaded && configLoaded && (
        <>
          <DropDown
            menu={clients}
            selectClient={selectClient}
            selectedClient={selectedClient}
          />
        </>
      )}

      {state === 'config' && (
        <div className="info-container main">
          <div>
            {tagsLoaded && (
              <Tags
                tags={tags}
                backupTags={backupTags}
                loadTags={loadTags}
                reloadBase={reloadBase}
                alnaVersion={selectedClient.alnaVersion}
              />
            )}
            {tagsLoaded && configLoaded && state === 'config' && (
              <Log logName={logName} saveLogName={(name) => setLogName(name)} />
            )}
            {tagsLoaded && configLoaded && (
              <div className="button-module">
                <button className="btn btn-path-selector" onClick={toggleBuild}>
                  Build
                </button>
              </div>
            )}
          </div>
          <div>
            {configLoaded && (
              <Config config={config} selectedClient={selectedClient} />
            )}
          </div>
        </div>
      )}
      {state === 'build' && (
        <div className="log-container">
          {showModal && (
            <Modal closeModal={closeModal} modalMessage={modalMessage} />
          )}
          <div className="display-linebreak">
            <div ref={messagesEndRef}></div>
            {log}
          </div>
          <button className="btn" onClick={toggleBuild}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Gui />} />
      </Routes>
    </Router>
  );
}
