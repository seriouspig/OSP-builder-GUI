import React, { useEffect, useState } from 'react';
import './Tags.css';
import ElementMaker from './ElementMaker';
import { config } from 'process';

const Tags = ({ tags }) => {
  const [alna, setAlna] = useState('');
  const [customerName, setCustomerName] = useState({old: '', new: ''});
  const [customerTag, setCustomerTag] = useState({ old: '', new: '' });
  const [content, setContent] = useState({ old: '', new: '' });
  const [base, setBase] = useState({ old: '', new: '' });
  const [baja, setBaja] = useState({ old: '', new: '' });
  const [tripman, setTripman] = useState({ old: '', new: '' });
  const [maps, setMaps] = useState({ old: '', new: '' });
  const [musicplayer, setMusicplayer] = useState({ old: '', new: '' });
  const [papause, setPapause] = useState({ old: '', new: '' });
  const [wow, setWow] = useState({ old: '', new: '' });

  const [editName, setEditName] = useState(false);
  const [editTag, setEditTag] = useState(false);
  const [editContent, setEditContent] = useState(false);
  const [editBase, setEditBase] = useState(false);
  const [editBaja, setEditBaja] = useState(false);
  const [editTripman, setEditTripman] = useState(false);
  const [editMaps, setEditMaps] = useState(false);
  const [editMusicplayer, setEditMusicplayer] = useState(false);
  const [editPapause, setEditPapause] = useState(false);
  const [editWow, setEditWow] = useState(false);

  useEffect(() => {
    console.log("--------- RESTARTED TAGS ---------")
    setAlna(tags.alna);
    setCustomerName({
      old: tags.customerName,
      new: tags.customerName,
    });
    setCustomerTag({
      old: tags.customerTag,
      new: tags.customerTag,
    });
    setContent({
      old: tags.content,
      new: tags.content,
    });
    setBase({
      old: tags.base,
      new: tags.base,
    });
    setBaja({
      old: tags.baja,
      new: tags.baja,
    });
    setTripman({
      old: tags.tripman,
      new: tags.tripman,
    });
    setMaps({
      old: tags.maps,
      new: tags.maps,
    });
    setMusicplayer({
      old: tags.musicplayer,
      new: tags.musicplayer,
    });
    setPapause({
      old: tags.papause,
      new: tags.papause,
    });
    setWow({
      old: tags.wow,
      new: tags.wow,
    });
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
    let oldValue = value.old;
    console.log(string + ' ' + oldValue);
    let newValue = value.new;
    console.log(string + ' ' + newValue);
    window.electron.ipcRenderer.sendMessage('change-text-tags-value', [
      oldValue,
      string,
      newValue,
    ]);
  };

  window.electron.ipcRenderer.once('change-text-tags-value', (arg) => {

    if (arg[1] === 'customerName') {
      setCustomerName({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'customerTag') {
      setCustomerTag({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'contenttag') {
      setContent({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'basetag') {
      setBase({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'bajatag') {
      setBaja({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'tripmantag') {
      setTripman({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'mapstag') {
      setMaps({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'musicplayertag') {
      setMusicplayer({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'papausetag') {
      setPapause({ old: arg[2], new: arg[2] });
    } else if (arg[1] === 'wowtag') {
      setWow({ old: arg[2], new: arg[2] });
    }
    
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
            handleChange={(e) =>
              setCustomerName({ old: customerName.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditName(true)}
            handleBlur={() => {
              handleTextChange(setCustomerName, customerName, 'customerName'),
                setEditName(false);
            }}
            showInputEle={editName}
          />
        </div>
        <div className="info-text">
          <div>Customer tag:</div>
          <ElementMaker
            value={customerTag.new}
            handleChange={(e) =>
              setCustomerTag({ old: customerTag.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditTag(true)}
            handleBlur={() => {
              handleTextChange(setCustomerTag, customerTag, 'customerTag'),
                setEditTag(false);
            }}
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
          <ElementMaker
            value={content.new}
            handleChange={(e) =>
              setContent({ old: content.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditContent(true)}
            handleBlur={() => {
              handleTextChange(setContent, content, 'contenttag'),
                setEditContent(false);
            }}
            showInputEle={editContent}
          />
        </div>
        <div className="info-text">
          <div>Base:</div>
          <ElementMaker
            value={base.new}
            handleChange={(e) =>
              setBase({ old: base.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditBase(true)}
            handleBlur={() => {
              handleTextChange(setBase, base, 'basetag'), setEditBase(false);
            }}
            showInputEle={editBase}
          />
        </div>
        <div className="info-text">
          <div>Baja:</div>
          <ElementMaker
            value={baja.new}
            handleChange={(e) =>
              setBaja({ old: baja.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditBaja(true)}
            handleBlur={() => {
              handleTextChange(setBaja, baja, 'bajatag'), setEditBaja(false);
            }}
            showInputEle={editBaja}
          />
        </div>
        <div className="info-text">
          <div>Tripman:</div>
          <ElementMaker
            value={tripman.new}
            handleChange={(e) =>
              setTripman({ old: tripman.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditTripman(true)}
            handleBlur={() => {
              handleTextChange(setTripman, tripman, 'tripmantag'),
                setEditTripman(false);
            }}
            showInputEle={editTripman}
          />
        </div>
        <div className="info-text">
          <div>Maps:</div>
          <ElementMaker
            value={maps.new}
            handleChange={(e) =>
              setMaps({ old: maps.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditMaps(true)}
            handleBlur={() => {
              handleTextChange(setMaps, maps, 'mapstag'), setEditMaps(false);
            }}
            showInputEle={editMaps}
          />
        </div>
        <div className="info-text">
          <div>Music Player:</div>
          <ElementMaker
            value={musicplayer.new}
            handleChange={(e) =>
              setMusicplayer({ old: musicplayer.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditMusicplayer(true)}
            handleBlur={() => {
              handleTextChange(setMusicplayer, musicplayer, 'musicplayertag'),
                setEditMusicplayer(false);
            }}
            showInputEle={editMusicplayer}
          />
        </div>
        <div className="info-text">
          <div>PA Pause:</div>
          <ElementMaker
            value={papause.new}
            handleChange={(e) =>
              setPapause({ old: papause.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditPapause(true)}
            handleBlur={() => {
              handleTextChange(setPapause, papause, 'papausetag'),
                setEditPapause(false);
            }}
            showInputEle={editPapause}
          />
        </div>
        <div className="info-text">
          <div>WOW:</div>
          <ElementMaker
            value={wow.new}
            handleChange={(e) =>
              setWow({ old: wow.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditWow(true)}
            handleBlur={() => {
              handleTextChange(setWow, wow, 'wowtag'), setEditWow(false);
            }}
            showInputEle={editWow}
          />
        </div>
      </div>
    </div>
  );
};

export default Tags;
