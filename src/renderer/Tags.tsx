import React, { useEffect, useState } from 'react';
import './Tags.css';
import ElementMaker from './ElementMaker';
import { config } from 'process';

const Tags = ({ tags }) => {
  const [alna, setAlna] = useState('');
  const [customerName, setCustomerName] = useState({old: '', new: ''});
  const [customerTag, setCustomerTag] = useState('');
  const [content, setContent] = useState('');
  const [base, setBase] = useState('');
  const [baja, setBaja] = useState('');
  const [tripman, setTripman] = useState('');
  const [maps, setMaps] = useState('');
  const [musicplayer, setMusicplayer] = useState('');
  const [papause, setPapause] = useState('');
  const [wow, setWow] = useState('');

  const [editName, setEditName] = useState(false);
  const [editTag, setEditTag] = useState(false);

  useEffect(() => {
    console.log("--------- RESTARTED TAGS ---------")
    setAlna(tags.alna);
    setCustomerName({
      old: tags.customerName,
      new: tags.customerName,
    });
    setCustomerTag(tags.customerTag);
    setContent(tags.content);
    setBase(tags.base);
    setBaja(tags.baja);
    setTripman(tags.tripman);
    setMaps(tags.maps);
    setMusicplayer(tags.musicplayer);
    setPapause(tags.papause);
    setWow(tags.wow);
  }, []);



  const toggleTagsValue = (setter, value, string) => {
    let newValue = '';
    if (value === '3.5.2') {
      newValue = '3.5.3';
    } else {
      newValue = '3.5.2';
    }
    setter(newValue);
    console.log('---THIS IS THE VALUE:');
    console.log(value);
    window.electron.ipcRenderer.sendMessage('toggle-tags-value', [
      value,
      string,
      newValue,
    ]);
  };

  const handleTextChange = (setter, value, string) => {
    setter(value)
    let oldValue = customerName.old;
    console.log(string + ' ' + oldValue);
    let newValue = customerName.new;
    console.log(string + ' ' + newValue);
    window.electron.ipcRenderer.sendMessage('change-text-tags-value', [
      oldValue,
      string,
      newValue,
    ]);
  };

  window.electron.ipcRenderer.once('change-text-tags-value', (arg) => {
    setCustomerName({old: arg, new: arg})
    console.log('Here are the tags:');
    console.log(arg);
    
  });

  return (
    <div className="info-module">
      <div className="header">TAGS</div>
      <div className="info tags">
        <div className="info-text">
          <div>Customer name:</div>
          <ElementMaker
            value={customerName.new}
            handleChange={(e) => setCustomerName({old: customerName.old, new: e.target.value})}
            handleDoubleClick={() => setEditName(true)}
            handleBlur={() =>
              handleTextChange(setCustomerName, customerName, 'customerName')
            }
            showInputEle={editName}
          />
        </div>
        <div className="info-text">
          <div>Customer tag:</div>
          <ElementMaker
            value={customerTag}
            handleChange={(e) => setCustomerTag(e.target.value)}
            handleDoubleClick={() => setEditTag(true)}
            handleBlur={() => setEditTag(false)}
            showInputEle={editTag}
          />
        </div>

        <div className="info-text">
          <div>Alna version:</div>
          <div className="info-radio">
            <label>
              <input
                type="radio"
                checked={alna === '3.5.2' && true}
                className="radio-button"
                onClick={() => toggleTagsValue(setAlna, alna, 'alna')}
              />
              3.5.2
            </label>
            <label>
              <input
                type="radio"
                checked={alna === '3.5.3' && true}
                className="radio-button"
                onClick={() => toggleTagsValue(setAlna, alna, 'alna')}
              />
              3.5.3
            </label>
          </div>
        </div>
        <div className="info-text">
          <div>Content:</div>
          <div className="tags-button">{content}</div>
        </div>
        <div className="info-text">
          <div>Base:</div>
          <div className="tags-button">{base}</div>
        </div>
        <div className="info-text">
          <div>Baja:</div>
          <div className="tags-button">{baja}</div>
        </div>
        <div className="info-text">
          <div>Tripman:</div>
          <div className="tags-button">{tripman}</div>
        </div>
        <div className="info-text">
          <div>Maps:</div>
          <div className="tags-button">{maps}</div>
        </div>
        <div className="info-text">
          <div>Music Player:</div>
          <div className="tags-button">{musicplayer}</div>
        </div>
        <div className="info-text">
          <div>PA Pause:</div>
          <div className="tags-button">{papause}</div>
        </div>
        <div className="info-text">
          <div>WOW:</div>
          <div className="tags-button">{wow}</div>
        </div>
      </div>
    </div>
  );
};

export default Tags;
