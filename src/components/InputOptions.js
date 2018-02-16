import React from 'react';

const InputOptions = (props) => (
  <div className="inputOptions">
    <button disabled={!props.isTyped} title="Bold" onClick={() => props.format("**", "**")}>
      <i className="fa fa-bold"/>
    </button>
    <button disabled={!props.isTyped} title="Italic" onClick={() => props.format("*", "*")}>
      <i className="fa fa-italic"/>
    </button>
    <button disabled={!props.isTyped} title="Code" onClick={() => props.format("`", "`")}>
      <i className="fa fa-code"/>
    </button>
    <button disabled={!props.isTyped} title="Link" onClick={() => props.format("[", "](* link *)")}>
      <i className="fa fa-link"/>
    </button>
  </div>
)

export default InputOptions