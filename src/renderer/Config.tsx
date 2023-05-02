import React, { useState, useEffect } from 'react';
import './Config.css';

const Config = ({ config, selectedClient }) => {
  const [integration, setIntegration] = useState(false);
  const [inboxVolume, setInboxVolume] = useState(false);
  const [inputPathRoot, setInputPathRoot] = useState('');
  const [outputPathRoot, setOutputPathRoot] = useState('');
  const [jsonPath, setJsonPath] = useState('');
  const [customerPath, setCustomerPath] = useState('');
  const [skipcreatestage, setSkipcreatestage] = useState(false);
  const [skipgit, setSkipgit] = useState(false);
  const [skipupdateconfigs, setSkipupdateconfigs] = useState(false);
  const [skipsetupsingpackage, setSkipsetupsingpackage] = useState(false);
  const [skipdop, setSkipdop] = useState(false);
  const [skipcontent, setSkipcontent] = useState(false);
  const [skiphtml, setSkiphtml] = useState(false);
  const [skipcreaterelease, setSkipcreaterelease] = useState(false);
  const [skipOpensslEncryption, setSkipopensslencryption] = useState(false);
  const [gpgSign, setGpgSign] = useState('');

  useEffect(() => {
    console.log(config);
    console.log('Config loaded');
    setIntegration(config.integration);
    setInboxVolume(config.inboxVolume);
    setSkipcreatestage(config.skipcreatestage);
    setSkipgit(config.skipgit);
    setSkipupdateconfigs(config.skipupdateconfigs);
    setSkipsetupsingpackage(config.skipsetupsingpackage);
    setSkipdop(config.skipdop);
    setSkipcontent(config.skipcontent);
    setSkiphtml(config.skiphtml);
    setInputPathRoot(config.integrationInputPathRoot);
    setOutputPathRoot(config.integrationOutputPathRoot);
    setJsonPath(config.integrationJsonPath);
    setCustomerPath(config.integrationCustomerPath);
    setGpgSign(config.gpgsign);
  }, []);

  const toggleValue = (setter, value, string) => {
    setter(!value);
    console.log('---THIS IS THE VALUE:');
    console.log(value);
    window.electron.ipcRenderer.sendMessage('toggle-config-value', [
      !value,
      string,
    ]);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('toggle-config-value', (arg) => {
      console.log(arg);
      if (arg === 'inboxVolume' && inboxVolume && !integration) {
        setTimeout(() => {
          console.log('Shoud change integration to true');
          toggleValue(setIntegration, integration, 'integration');
        }, 100);
      } else if (arg === 'integration' && inboxVolume && !integration) {
        setTimeout(() => {
          console.log('Shoud change InboxVolume to false');
          toggleValue(setInboxVolume, inboxVolume, 'inboxVolume');
        }, 100);
      }
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('toggle-config-value');
    };
  });

  const selectPath = (path) => {
    console.log('----- selecting config path -------');
    window.electron.ipcRenderer.sendMessage('select-config-path', path);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('select-config-path', (arg) => {
      console.log('--------config path from main---------');
      console.log(arg);
      if (arg.pathType === 'integrationInputPathRoot') {
        setInputPathRoot(arg.path);
      } else if (arg.pathType === 'integrationOutputPathRoot') {
        setOutputPathRoot(arg.path);
      } else if (arg.pathType === 'integrationCustomerPath') {
        setCustomerPath(arg.path);
      } else if (arg.pathType === 'integrationJsonPath') {
        setJsonPath(arg.path);
      } else {
        console.log('No path selected');
      }
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners('select-config-path');
    };
  });

  return (
    <div className="info-module">
      <div className="header">CONFIG</div>
      <div className="info config">
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={integration}
              className="checkbox"
              onChange={() =>
                toggleValue(setIntegration, integration, 'integration')
              }
            />
            Integration mode
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={inboxVolume}
              className="checkbox"
              onChange={() =>
                toggleValue(setInboxVolume, inboxVolume, 'inboxVolume')
              }
            />
            Create Inbox Volume
          </label>
        </div>
        <div className="info-checkbox">
          <div>Input Path Root:</div>

          <div
            className="btn-path"
            onDoubleClick={() =>
              selectPath({
                pathType: 'integrationInputPathRoot',
                oldPath: inputPathRoot,
              })
            }
          >
            {inputPathRoot}
          </div>
        </div>
        <div className="info-checkbox">
          <div>Output Path Root:</div>

          <div
            className="btn-path"
            onDoubleClick={() =>
              selectPath({
                pathType: 'integrationOutputPathRoot',
                oldPath: outputPathRoot,
              })
            }
          >
            {outputPathRoot}
          </div>
        </div>
        <div className="info-checkbox">
          <div>CustomerPath:</div>
          <div
            className="btn-path"
            onDoubleClick={() =>
              selectPath({
                pathType: 'integrationCustomerPath',
                oldPath: customerPath,
              })
            }
          >
            {customerPath}
          </div>
        </div>
        <div className="info-checkbox">
          <div>JSON path:</div>
          <div
            className="btn-path"
            onDoubleClick={() =>
              selectPath({
                pathType: 'integrationJsonPath',
                oldPath: jsonPath,
              })
            }
          >
            {jsonPath}
          </div>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skipcreatestage}
              className="checkbox"
              onChange={() =>
                toggleValue(
                  setSkipcreatestage,
                  skipcreatestage,
                  'skipcreatestage'
                )
              }
            />
            Create Stage
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skipgit}
              className="checkbox"
              onChange={() => toggleValue(setSkipgit, skipgit, 'skipgit')}
            />
            Git
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skipupdateconfigs}
              className="checkbox"
              onChange={() =>
                toggleValue(
                  setSkipupdateconfigs,
                  skipupdateconfigs,
                  'skipupdateconfigs'
                )
              }
            />
            Update Configs
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skipsetupsingpackage}
              className="checkbox"
              onChange={() =>
                toggleValue(
                  setSkipsetupsingpackage,
                  skipsetupsingpackage,
                  'skipsetupstagingpackage'
                )
              }
            />
            Setup Staging Package
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skipdop}
              className="checkbox"
              onChange={() => toggleValue(setSkipdop, skipdop, 'skipdop')}
            />
            DOP
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skipcontent}
              className="checkbox"
              onChange={() =>
                toggleValue(setSkipcontent, skipcontent, 'skipcontent')
              }
            />
            Content
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skiphtml}
              className="checkbox"
              onChange={() => toggleValue(setSkiphtml, skiphtml, 'skiphtml')}
            />
            Html
          </label>
        </div>
        <div className="info-checkbox">
          <label>
            <input
              type="checkbox"
              checked={!skipcreaterelease}
              className="checkbox"
              onChange={() =>
                toggleValue(
                  setSkipcreaterelease,
                  skipcreaterelease,
                  'skipcreaterelease'
                )
              }
            />
            Create Realease
          </label>
        </div>
        <div className="info-text">
          <div>Encryption:</div>
          <div className="info-radio">
            <label>
              <input
                type="radio"
                checked={skipOpensslEncryption && true}
                className="radio-button"
                onClick={() =>
                  toggleValue(
                    setSkipopensslencryption,
                    skipOpensslEncryption,
                    'skipopensslencryption'
                  )
                }
              />
              GPG
            </label>
            <label>
              <input
                type="radio"
                checked={!skipOpensslEncryption && true}
                className="radio-button"
                onClick={() =>
                  toggleValue(
                    setSkipopensslencryption,
                    skipOpensslEncryption,
                    'skipopensslencryption'
                  )
                }
              />
              openSSL
            </label>
          </div>
        </div>
        <div className="info-checkbox">
          <div>GPG Sign:</div>
          <div className="btn-path">{selectedClient.gpgSign}</div>
        </div>
      </div>
    </div>
  );
};

export default Config;
