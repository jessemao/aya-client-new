import React, { Component } from 'react';
import { getComponent } from '../../../utils/component-map';

class KeyValuePairComponent extends Component {
  static defaultProps = {
    key: '',
    value: '',
  }

  constructor(props) {
    super(props);
    this.state = props.value;
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.value);
  }

  formatValue(val, options) {
    const { key } = options;
    if (key === 'key') {
      this.setState({
        key: val,
      });
      return {
        key: val,
        value: this.state.value,
      };
    }
    if (key === 'value') {
      this.setState({
        value: val,
      });
      return {
        key: this.state.key,
        value: val,
      };
    }
  }

  handleChange(val, options) {
    const { onChange } = this.props;
    const res = this.formatValue(val, options);
    onChange(res, options);
  }

  render() {
    const { components, ...others } = this.props;
    return (
      <div className="common-map">
        {
          components.map((compProps) => {
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

export default KeyValuePairComponent;
