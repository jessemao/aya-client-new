import React, { Component } from 'react';
import { getComponent } from '../../../utils/component-map';

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }


  formatValue(val, options) {
    const { key } = options;

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
            const index = others['data-index'];
            const value = others.value ? others.value[compProps.key] : null;
            const specificProps = {
              onChange: (val) => this.handleChange(val, { ...compProps, index }),
              className: 'common-item-row',
              value,
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
