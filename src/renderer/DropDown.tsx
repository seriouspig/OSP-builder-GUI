import React, { useEffect, useRef, useState } from 'react';
import './DropDown.css';

const DropDown = ({ menu, selectClient, selectedClient }) => {
  const [open, setOpen] = useState(false);
  const clientsContainerRef = useRef(null);

  const handleOpen = () => {
    console.log('Trying to open');
    console.log(menu);
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      console.log(menu.length)
      clientsContainerRef.current.style.height = menu.length*40 + `px`;
    } else {
      clientsContainerRef.current.style.height = '0px';
    }
  }, [open]);

  console.log(menu)

  return (
    <div>
      <div className="info-container">
        <div
          className="btn btn-path-selector client-selector"
          onClick={handleOpen}
        >
          select client
        </div>

        <div className="message-box">
          <div className="client-version name">{selectedClient.name}</div>
          {selectedClient.alnaVersion && (
            <div className="client-version alna">
              Alna Version: {selectedClient.alnaVersion}
            </div>
          )}
        </div>
      </div>
      <div className="info-container">
        <div
          className="clients-container show-container"
          ref={clientsContainerRef}
          onClick={handleOpen}
        >
          
          { menu !== "no clients" &&
          
          <ul className="clients">
            {menu.map((client) => {
              return (
                <li onClick={() => selectClient(client.id)}>{client.name}</li>
              );
            })}
          </ul>
          }
        </div>
      </div>
    </div>
  );
};

export default DropDown;
