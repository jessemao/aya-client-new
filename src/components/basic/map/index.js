import React, { Component } from 'react';
import { getComponent } from '../../../utils/component-map';

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
    const updatedValue = this.formatValue(val, options);
    onChange(updatedValue, options);
  }

  render() {
    const { childComponent, ...others } = this.props;
    return (
      <div className="common-map">
        {
          childComponent.map((compProps) => {
            const specificProps = {
              onChange: (val) => this.handleChange(val, { ...compProps, index: others['data-index'] }),
              className: 'common-item-row',
              value: this.state[compProps.key],
            };
            const customProps = { ...compProps, ...specificProps };
            return getComponent(customProps);
          })
        }
      </div>
    );
  }
}

export default MapComponent;
