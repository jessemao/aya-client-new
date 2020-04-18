import React, { Component } from 'react';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './index.css';
import handleChange from '../../../utils/decorators/handle-change';

@handleChange()
class RichText extends Component {
  render() {
    let { value } = this.props;
    if (!value || (value.isEmpty && value.isEmpty())) {
      value = this.props['data-__meta'].initialValue;
    }

    if (typeof value === 'string') {
      value = BraftEditor.createEditorState(value);
    }
    // if (typeof value === 'undefined') {
    //   return null;
    // }
    return (
      <BraftEditor
        className="richtext-editor"
        {...this.props}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}

export default RichText;
