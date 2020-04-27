import React from 'react';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './index.css';

export default (props) => (
  <BraftEditor
    className="richtext-editor"
    {...props}
    value={BraftEditor.createEditorState(props.value)}
  />
);
