import { useEffect, useState } from 'react';
import './Tags.css';
import ElementMaker from './ElementMaker';

const Tags = ({ tags, backupTags, loadTags, reloadBase, alnaVersion }) => {
  const [alna, setAlna] = useState('');
  const [customerName, setCustomerName] = useState({ old: '', new: '' });
  const [customerTag, setCustomerTag] = useState({ old: '', new: '' });
  const [content, setContent] = useState({ old: '', new: '' });
  const [base, setBase] = useState({ old: '', new: '' });
  const [baja, setBaja] = useState({ old: '', new: '' });
  const [tripman, setTripman] = useState({ old: '', new: '' });
  const [maps, setMaps] = useState({ old: '', new: '' });
  const [musicplayer, setMusicplayer] = useState({ old: '', new: '' });
  const [papause, setPapause] = useState({ old: '', new: '' });
  const [wow, setWow] = useState({ old: '', new: '' });
  const [data, setData] = useState({ old: '', new: '' });

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
  const [editData, setEditData] = useState(false);

  useEffect(() => {
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
    setData({
      old: tags.data,
      new: tags.data,
    });
  }, []);

  const handleTextChange = (setter, value, string) => {
    setter(value);
    let oldValue = value.old;
    let newValue = value.new;
    if (string === 'datatag') {
          window.electron.ipcRenderer.sendMessage('change-data-tag-value', [
            oldValue,
            string,
            newValue,
          ]);
    } else {
      window.electron.ipcRenderer.sendMessage('change-text-tags-value', [
        oldValue,
        string,
        newValue,
      ]);
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('change-text-tags-value', (arg) => {
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
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('change-text-tags-value');
    };
  });

  return (
    <div className="info-module">
      <div className="header">TAGS</div>
      <div className="info tags">
        <div className="info-text">
          <div>Customer name:</div>
          <ElementMaker
            className="tags-button"
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
            className="tags-button"
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
          <ElementMaker className="tags-button disabled" value={alnaVersion} />
        </div>
        <div className="info-text">
          <div>Content:</div>
          <ElementMaker
            className="tags-button"
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
            className="tags-button"
            value={base.new}
            handleChange={(e) =>
              setBase({ old: base.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditBase(true)}
            handleBlur={() => {
              handleTextChange(setBase, base, 'basetag'), setEditBase(false);
              reloadBase(base);
            }}
            showInputEle={editBase}
          />
        </div>
        <div className="info-text">
          <div>Baja:</div>
          <ElementMaker
            className="tags-button"
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
            className="tags-button"
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
            className="tags-button"
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
            className="tags-button"
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
            className="tags-button"
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
            className="tags-button"
            value={wow.new}
            handleChange={(e) => setWow({ old: wow.old, new: e.target.value })}
            handleDoubleClick={() => setEditWow(true)}
            handleBlur={() => {
              handleTextChange(setWow, wow, 'wowtag'), setEditWow(false);
            }}
            showInputEle={editWow}
          />
        </div>
        <div className="info-text">
          <div>Data Store:</div>
          <ElementMaker
            className="tags-button"
            value={data.new}
            handleChange={(e) =>
              setData({ old: data.old, new: e.target.value })
            }
            handleDoubleClick={() => setEditData(true)}
            handleBlur={() => {
              handleTextChange(setData, data, 'datatag'), setEditData(false);
            }}
            showInputEle={editData}
          />
        </div>
        <div className="info-text">
          <button
            className="btn btn-path-selector small-btn"
            onClick={backupTags}
          >
            Backup tags
          </button>
          <button
            className="btn btn-path-selector small-btn"
            onClick={loadTags}
          >
            Load tags
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tags;
