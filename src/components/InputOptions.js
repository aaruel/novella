import React from 'react';

const InputOptions = (props) => (
  <div className={`inputOptions${props.visible ? " inTop" : ""}`}>
    <button title="Bold" onClick={() => props.format("**", "**")}>
      <i className="fa fa-bold"/>
    </button>
    <button title="Italic" onClick={() => props.format("*", "*")}>
      <i className="fa fa-italic"/>
    </button>
    <button title="Code" onClick={() => props.format("`", "`")}>
      <i className="fa fa-code"/>
    </button>
    <button title="Link" onClick={() => props.format("[", "](* link *)")}>
      <i className="fa fa-link"/>
    </button>
  </div>
)

export default InputOptions