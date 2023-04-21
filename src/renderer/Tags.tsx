import React, { useEffect, useState } from 'react';
import './Tags.css';

const Tags = ({ tags }) => {
  const [alna, setAlna] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerTag, setCustomerTag] = useState('');
  const [content, setContent] = useState('');
  const [base, setBase] = useState('');
  const [baja, setBaja] = useState('');
  const [tripman, setTripman] = useState('');
  const [maps, setMaps] = useState('');
  const [musicplayer, setMusicplayer] = useState('');
  const [papause, setPapause] = useState('');
  const [wow, setWow] = useState('');

  useEffect(() => {
    setAlna(tags.alna);
    setCustomerName(tags.customerName);
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

  return (
    <div className="info-module">
      <div className="header">TAGS</div>
      <div className="info tags">
        <div className="info-text">
          <div>Customer name:</div>
          <div className="tags-button">{customerName}</div>
        </div>
        <div className="info-text">
          <div>Customer tag:</div>
          <div className="tags-button">{customerTag}</div>
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
