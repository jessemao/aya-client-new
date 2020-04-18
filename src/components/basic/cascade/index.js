import React, { Component } from 'react';
import { getComponent } from '../../../utils/component-map';

class CascadeComponent extends Component {
  constructor(props) {
    super(props);
    const { value = {} } = props;
    this.state = {
      value,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;
    if (!(value && Object.keys(value).length) && nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  handleChange(val, options) {
    const { onChange } = this.props;
    const { value } = this.state;
    const tempValue = Object.assign({}, value, {
      [options.key]: val,
    });
    this.setState({
      value: tempValue,
    });
    if (onChange) {
      onChange(tempValue);
    }
  }

  renderItems() {
    const { components } = this.props;
    return components.map((compProps) => {
      const specificProps = {
        'data-key': compProps.key,
        onChange: this.handleChange,
        value: this.state.value[compProps.key],
      };
      if (compProps.parentKey) {
        specificProps.parentValue = this.state.value[compProps.parentKey];
      }
      const customProps = Object.assign({}, compProps, specificProps);
      return getComponent(customProps);
    });
  }

  render() {
    return (
      <div>
        {
          this.renderItems()
        }
      </div>
    );
  }
}

export default CascadeComponent;
