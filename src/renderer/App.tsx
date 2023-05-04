import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useCallback, useEffect, useState, useRef } from 'react';
import Tags from './Tags';
import Config from './Config';
import Settings from './Settings';
import Log from './Log';
import DropDown from './DropDown';
import logoImg from './images/logo2.png';
import settingsSvg from './images/settings.svg';
import closeSvg from './images/close.svg';
import Modal from './Modal';

function Hello() {
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
    console.log("Client change")
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
    console.log('Tags changed');
    console.log(tags.base);
    setLogName('buildlogs/' + tags.base);
  }, [tags]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-clients');
  }, []);

  useEffect(() => {
    console.log('State Changed');
    // window.electron.ipcRenderer.sendMessage('get-builder-path');
    window.electron.ipcRenderer.sendMessage('get-tags');
    window.electron.ipcRenderer.sendMessage('get-config');
  }, [builderPath]);

  // useEffect(() => {
  //   setLogName('buildlogs/' + tags.base);
  // }, [state])

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
      console.log('GETTING TAGS');
      setTagsLoaded(false);
      console.log(arg);
      if (arg !== 'no tags') {
        setTags(arg);
        // setLogName('buildlogs/' + tags.base);
        setState('config');
        setTagsImporting(false);
        setTagsLoaded(true);
      } else {
        console.log('Here are the tags:');
        console.log(arg);

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
        console.log('Here is the config:');
        console.log(arg);
        setConfigLoaded(true);
      } else {
        console.log('Here is the config:');
        console.log(arg);
        setConfigLoaded(false);
      }
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-config');
    };
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('get-builder-path', (arg) => {
      console.log('--------builder path---------');
      console.log(arg);
      setBuilderPath(arg);
      window.electron.ipcRenderer.removeAllListeners('get-builder-path');
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-builder-path');
    };
  });

  const toggleBuild = () => {
    console.log('------------------------------');
    console.log(state);
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
      console.log('Here is the log:');
      console.log(arg);
      setLog(`${log}${arg}`);
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('output');
    };
  });

  const handleSelectBuilderPath = () => {
    console.log('=========SHOULD OPEN WINDOW=============');
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
    console.log('Backing up tags');
    window.electron.ipcRenderer.sendMessage('backup-tags');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('backup-tags', (arg) => {
      console.log(arg);
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('backup-tags');
    };
  });

  const loadTags = () => {
    console.log('Loading tags');
    setTagsImporting(true);
    window.electron.ipcRenderer.sendMessage('load-tags');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('load-tags', (arg) => {
      setState('loading');
      console.log('Seding ');
      window.electron.ipcRenderer.sendMessage('get-tags');
      console.log(arg);
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

      console.log('arg');
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
      selectedClient.gpgSign
    );
  }, [selectedClient]);

  const reloadBase = (base) => {
    console.log(base.new);
    setTags((prevState) => ({
      // object that we want to update
      ...prevState, // keep all other key-value pairs
      base: base.new, // update the value of specific key
    }));
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const scrollToBottom = () => {
    // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
