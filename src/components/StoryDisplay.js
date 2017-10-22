import React from 'react';

import ReactMarkdown from 'react-markdown';
import StoryLoading from './StoryLoading.js';
import { formatSen } from "../Utils.js";

class StoryDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="storyDisplay">
        {!this.props.sentences ?
          <StoryLoading /> :
          this.props.sentences.map(
            (sentence, index) => (
              <ReactMarkdown
                key={index}
                className="storySen"
                containerTagName="span"
                source={formatSen(sentence.content) + "&nbsp;"}
                disallowedTypes={["Paragraph"]}
                unwrapDisallowed={true}/>
            )
          )
        }
        <ReactMarkdown
          className="previewSen"
          containerTagName="span"
          source={this.props.input}
          disallowedTypes={["Paragraph", "HtmlBlock"]}
          unwrapDisallowed={true} />
      </div>
    )
  }
}

export default StoryDisplay
