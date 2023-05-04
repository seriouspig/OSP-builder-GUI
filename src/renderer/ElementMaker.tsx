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
            className="tags-button input"
            type="text"
            value={props.value}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            autoFocus
          />
        ) : (
          <div className={props.className}
            onDoubleClick={props.handleDoubleClick}
          >
            {props.value}
          </div>
        )
      }
    </span>
  );
}

export default ElementMaker;
