import React, { useEffect, useState } from 'react'
import './Tags.css'

const Tags = ({ tags }) => {

  const [alna, setAlna] = useState('')

  useEffect(() => {
    setAlna(tags.alna)
  }, [])

  return (
    <div className="info-module">
      <div className="header">TAGS</div>
      <div className="info tags">
        <div className="info-text">
          <div>Customer name:</div>
          <div>{tags.customerName}</div>
        </div>
        <div className="info-text">
          <div>Customer tag:</div>
          <div>{tags.customerTag}</div>
        </div>
        <div className="info-text">
          <div>Alna version:</div>
          <div className="info-radio">
            <label>
              <input
                type="radio"
                checked={alna === '3.5.2' && true}
                className="radio-button"
                onClick={() => setAlna('3.5.2')}
              />
              3.5.2
            </label>
            <label>
              <input
                type="radio"
                checked={alna === '3.5.3' && true}
                className="radio-button"
                onClick={() => setAlna('3.5.3')}
              />
              3.5.3
            </label>
          </div>
        </div>
        <div className="info-text">
          <div>Content:</div>
          <div>{tags.content}</div>
        </div>
        <div className="info-text">
          <div>Base:</div>
          <div>{tags.base}</div>
        </div>
        <div className="info-text">
          <div>Baja:</div>
          <div>{tags.baja}</div>
        </div>
        <div className="info-text">
          <div>Tripman:</div>
          <div>{tags.tripman}</div>
        </div>
        <div className="info-text">
          <div>Maps:</div>
          <div>{tags.maps}</div>
        </div>
        <div className="info-text">
          <div>Music Player:</div>
          <div>{tags.musicplayer}</div>
        </div>
        <div className="info-text">
          <div>PA Pause:</div>
          <div>{tags.papause}</div>
        </div>
        <div className="info-text">
          <div>WOW:</div>
          <div>{tags.wow}</div>
        </div>
      </div>
    </div>
  );
};

export default Tags