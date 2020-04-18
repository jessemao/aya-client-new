import React, { Component } from 'react';
import { getComponent } from '../../../utils/component-map';
import { isObject } from '../../../utils';

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = props.value;
    this.handleChange = this.handleChange.bind(this);
  }


  formatValue(val, options) {
    const { key, type } = options;
    this.setState({
      [key]: val,
    });
    return {
      [key]: val,
    };
  }

  handleChange(val, options) {
    const { onChange } = this.props;
    this.formatValue(val, options);
    onChange(this.state, options);
  }

  render() {
    const { children, ...others } = this.props;
    return (
      <div className="common-map">
        {
          children.map((compProps) => {
            const specificProps = {
              onChange: this.handleChange,
              'data-key': compProps.key,
              'data-index': others['data-index'],
              className: 'common-item-row',
              value: this.state[compProps.key],
            };
            const customProps = Object.assign({}, compProps, specificProps);

            return getComponent(customProps);
          })
        }
      </div>
    );
  }
}

export default MapComponent;
