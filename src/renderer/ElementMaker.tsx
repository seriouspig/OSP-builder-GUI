// ElementMaker.js

import React from 'react';

// Create an ElementMaker component
function ElementMaker(props) {
  return (
    <span>
      {
        // Use JavaScript's ternary operator to specify <span>'s inner content
        props.showInputEle ? (
          <input
            type="text"
            value={props.value}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            autoFocus
          />
        ) : (
          <span
            onDoubleClick={props.handleDoubleClick}
            style={{
              display: 'inline-block',
              height: '25px',
              minWidth: '300px',
            }}
          >
            {props.value}
          </span>
        )
      }
    </span>
  );
}

export default ElementMaker;
