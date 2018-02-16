import React from 'react';

import ReactMarkdown from 'react-markdown';
import StoryLoading from './StoryLoading.js';
import { formatSen } from "../Utils.js";

export default class StoryDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="storyDisplay">
        {!this.props.sentences ?
          <StoryLoading error={this.props.error} /> :
          this.props.sentences.map(
            (sentence, index) => (
              <ReactMarkdown
                key={index}
                className="storySen"
                containerTagName="span"
                source={formatSen(sentence.content) + "&nbsp;"}
                disallowedTypes={["paragraph"]}
                unwrapDisallowed={true} />
            )
          )}
        <ReactMarkdown
          className="previewSen"
          containerTagName="span"
          source={this.props.input}
          disallowedTypes={["paragraph"]}
          unwrapDisallowed={true} />
      </div>
    )
  }
}
