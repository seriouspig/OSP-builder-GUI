import React, { useState, useEffect } from 'react';
import './Config.css';

const Config = ({ config, updateConfig }) => {
  const [integration, setIntegration] = useState(false);
  const [inboxVolume, setInboxVolume] = useState(false);
  const [skipcreatestage, setSkipcreatestage] = useState(false);
  const [skipgit, setSkipgit] = useState(false);
  const [skipupdateconfigs, setSkipupdateconfigs] = useState(false);
  const [skipsetupsingpackage, setSkipsetupsingpackage] = useState(false);
  const [skipdop, setSkipdop] = useState(false);
  const [skipcontent, setSkipcontent] = useState(false);
  const [skiphtml, setSkiphtml] = useState(false);
  const [skipcreaterelease, setSkipcreaterelease] = useState(false);
  const [skipOpensslEncryption, setSkipopensslencryption] = useState(false);

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
        <div className="info-text">
          <div>Input Path Root:</div>
          <div>{config.integrationInputPathRoot}</div>
        </div>
        <div className="info-text">
          <div>Output Path Root:</div>
          <div>{config.integrationOutputPathRoot}</div>
        </div>
        <div className="info-text">
          <div>CustomerPath:</div>
          <div>{config.integrationCustomerPath}</div>
        </div>
        <div className="info-text">
          <div>JSON path:</div>
          <div>{config.integrationJsonPath}</div>
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
          <div>Alna version:</div>
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
      </div>
    </div>
  );
};

export default Config;
